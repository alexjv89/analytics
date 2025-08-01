import 'server-only';
import path from 'path';
import fs from 'fs';
import async from 'async';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function uploadFileToS3(file) {
  const workflow = {
    saveFileLocally: async () => {
      const uploadDir = path.join(process.cwd(), '.tmp', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExtension = path.extname(file.name || file.originalname);
      const uniqueFileName = uuidv4() + fileExtension;
      const filePath = path.join(uploadDir, uniqueFileName);

      const writeStream = fs.createWriteStream(filePath);
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      writeStream.write(data);
      writeStream.end();

      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => resolve({ filePath, fileName: uniqueFileName }));
        writeStream.on('error', err => reject(err));
      });
    },
    uploadToS3: [
      'saveFileLocally',
      async function (results, cb) {
        const localFile = results.saveFileLocally;
        const s3 = new S3Client({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ACCESS_SECRET,
          },
        });

        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: localFile?.fileName,
          Body: fs.createReadStream(localFile.filePath),
          ContentType: file.type,
        };

        const command = new PutObjectCommand(params);
        const data = await s3.send(command);
        return data;
      },
    ],
    getPublicUrl: [
      'uploadToS3',
      async results => {
        const localFile = results.saveFileLocally;
        const publicUrl = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${localFile.fileName}`;
        return { publicUrl };
      },
    ],
    deleteFileFromLocal: [
      'uploadToS3',
      async results => {
        const localFile = results.saveFileLocally;
        fs.unlinkSync(localFile.filePath);
        return { success: true, message: `Successfully deleted the file: ${localFile.filePath}` };
      },
    ],
  };

  const results = await async.auto(workflow);
  return results;
}

export async function getSignedFileUrl(location, fileName = 'alex.csv', expiresIn = 3600) {
  try {
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_ACCESS_SECRET,
      },
    });

    const key = location.includes('amazonaws.com') ? location.split('.com/')[1] : location;

    // Command for inline viewing
    const inlineCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      ResponseContentDisposition: 'inline',
    });

    // Command for downloading
    const downloadCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${fileName}"`,
    });

    const [inlineUrl, downloadUrl] = await Promise.all([
      getSignedUrl(s3, inlineCommand, { expiresIn }),
      getSignedUrl(s3, downloadCommand, { expiresIn }),
    ]);

    return { raw: location, inlineUrl, downloadUrl };
  } catch (error) {
    console.error('Error generating signed URLs:', error);
    throw error;
  }
}

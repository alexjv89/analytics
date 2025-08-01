import path from "path";
/**
 * Gets the full storage path for an SQLite file.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.filePath - The input string that could be a filename or a path (with or without extension).
 * @param {string} [params.defaultDir='database/data'] - The default directory path to use if none is provided.
 * @param {string} [params.defaultExt='.db'] - The default file extension to use if none is provided.
 * @returns {string} - The generated absolute storage path for the SQLite file.
 */
export function getSQLiteStoragePath({
  filePath,
  defaultDir = "database/data",
  defaultExt = ".db",
}) {
  filePath = filePath.trim();
  let ext = path.extname(filePath) || defaultExt;
  let filename = filePath.replace(ext, "");
  if (filePath.includes("/")) {
    return path.resolve(process.cwd(), filePath);
  }
  return path.resolve(process.cwd(), defaultDir, `${filename}${ext}`);
}

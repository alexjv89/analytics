import "server-only"
import CSV from "papaparse";
import * as XLSX from "xlsx";
import PDFParser from "pdf2json";

export async function readXLSXFiles(file) {
  try {
    let data;
    
    if (file instanceof ArrayBuffer) {
      data = new Uint8Array(file);
    } else {
      const arrayBuffer = await file.arrayBuffer();
      data = new Uint8Array(arrayBuffer);
    }
    
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    });
    return jsonData;
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw error;
  }
}

export async function readCSVFiles(file, options) {
  try {
    const text = new TextDecoder().decode(file);
    const jsonData = CSV.parse(text, options).data;
    return jsonData;
  } catch (error) {
    console.error("Error reading CSV file:", error);
    throw error;
  }
}

export async function readPdfFiles(file) {
  try {
    const pdfParser = new PDFParser();
    pdfParser.parseBuffer(Buffer.from(file));

    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", pdfData => {
        const textContent = pdfData.Pages.map(page => {
          const m = new Map()
          page.Texts.forEach(text => {
            const y = text.y
            let arr = []
            if (!m.has(y))
              m.set(y, arr)
            else {
              arr = m.get(y)
            }

            arr.push({ value: decodeURIComponent(text.R[0].T) ?? '', x: text.x, y: text.y })
          })
          return Array.from(m.values()).sort((a, b) => a[0].y - b[0].y)
        })
        resolve(textContent);
      });
    });
  } catch (error) {
    console.error("Error reading PDF file:", error);
    throw error;
  }
}

export function fingerprint(t){
  return `D-(${t.date})-IF-(${t.inflow})-OF-(${t.outflow})-P-(${t.particulars.replaceAll(' ','')})`
}
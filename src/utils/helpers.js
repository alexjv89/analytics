import * as XLSX from "xlsx";
import CSV from "papaparse";

export const formatDate = (dateString, format) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ordinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  if (format == "date") {
    return `${day}${ordinalSuffix(day)} ${month}, ${year}`;
  }

  if (format == "date-time") {
    return `${hours}:${minutes}, ${day}${ordinalSuffix(day)} ${month}`;
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function getDisplayName(dataParser, accountName) {
  const lowerCaseParser = dataParser.toLowerCase();
  const bankNames = ["icici", "hdfc", "fdrl"];
  const bankName = bankNames.find((name) => lowerCaseParser.includes(name));

  if (!bankName) {
    throw new Error("Unknown bank name");
  }

  const lastThreeDigits = accountName.slice(-3);

  if (lowerCaseParser.includes("credit_card")) {
    return `CC ${bankName.toUpperCase()} ${lastThreeDigits}`;
  }

  return `${bankName.toUpperCase()} XXX ${lastThreeDigits}`;
}

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
    console.error('Error reading XLSX file:', error);
    throw error;
  }
}

export async function readCSVFiles(file, options) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);
    const jsonData = CSV.parse(text, options).data;
    return jsonData;
  } catch (error) {
    console.error("Error reading CSV file:", error);
    throw error;
  }
} 
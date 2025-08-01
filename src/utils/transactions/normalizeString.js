export default function normalizeString(str) {
  return str
    .toUpperCase()
    .replace(/[,\.]/g, '')  // Remove punctuation
    .replace(/\s+/g, ' ')   // Normalize spaces
    .trim();
}
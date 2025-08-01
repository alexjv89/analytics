import currencies from "@/config/currencies";

export const formatDate = (dateString, format) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ordinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // Exceptions for 11th, 12th, 13th
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

  //If credit card use a differnt format
  if (lowerCaseParser.includes("credit_card")) {
    return `CC ${bankName.toUpperCase()} ${lastThreeDigits}`;
  }

  return `${bankName.toUpperCase()} XXX ${lastThreeDigits}`;
}

export function convertFloatToCurrencyInteger(amount) {
  amount =
    typeof amount === "string" ? parseFloat(amount.replace(/,/g, "")) : amount;
  return Math.round(amount * 1000);
}

export function findCurrency(input) {
  const result = currencies.find(
    (currency) => currency.symbol === input || currency.alias === input
  );

  return result ? result.code : input;
}

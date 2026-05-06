const LOCALE = "es-PE";
const CURRENCY = process.env.APP_CURRENCY ?? "PEN";

export function formatCurrency(value: number | string): string {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}


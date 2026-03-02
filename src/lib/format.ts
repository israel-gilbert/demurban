/**
 * Formats a money amount expressed in minor units (e.g., kobo for NGN, cents for USD).
 */
export function formatMoney(amountMinor: number, currency: string) {
  const major = amountMinor / 100;

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      // For NGN we typically display 0 decimals in consumer pricing.
      maximumFractionDigits: currency === "NGN" ? 0 : 2,
    }).format(major);
  } catch {
    const shown = currency === "NGN" ? Math.round(major) : major;
    return `${currency} ${shown.toLocaleString()}`;
  }
}

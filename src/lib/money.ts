export function nairaToKobo(naira: number) {
  return Math.round(naira * 100);
}

export function koboToNaira(kobo: number) {
  return kobo / 100;
}

export function formatNGNFromKobo(kobo: number) {
  const safe = Number.isFinite(kobo) ? kobo : 0;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(safe / 100);
}
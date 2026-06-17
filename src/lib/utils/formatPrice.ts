export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatPriceShort(price: number): string {
  const n = price % 1 === 0 ? String(price) : price.toFixed(2);
  return `€${n}`;
}

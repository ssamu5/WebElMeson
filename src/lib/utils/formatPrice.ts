export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatPriceShort(price: number): string {
  return `${price % 1 === 0 ? price : price.toFixed(2)} EUR`;
}

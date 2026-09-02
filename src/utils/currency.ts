export function formatInr(amount: number, options?: { compact?: boolean }) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: options?.compact ? 0 : 2,
  }).format(amount);
}

export function discountPercent(price: number, salePrice: number) {
  if (price <= 0 || salePrice >= price) {
    return 0;
  }
  return Math.round(((price - salePrice) / price) * 100);
}

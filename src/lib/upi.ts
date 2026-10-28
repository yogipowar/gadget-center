import { publicEnv } from "@/config/public-env";

export const UPI_LIMIT_RUPEES = 100_000;

export function canPayByUpi(amountRupees: number) {
  return amountRupees > 0 && amountRupees <= UPI_LIMIT_RUPEES;
}

export function buildUpiPayUrl(input: {
  amountRupees: number;
  orderNumber: string;
  payeeName?: string;
  upiId?: string;
}) {
  const pa = (input.upiId ?? publicEnv.upiId).trim();
  const pn = (input.payeeName ?? publicEnv.bankAccountName).trim();
  const tn = input.orderNumber.replace(/[^\w-]/g, "").slice(0, 50);
  const am = input.amountRupees.toFixed(2);
  return `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${am}&cu=INR&tn=${encodeURIComponent(tn)}`;
}

export function qrImageUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(data)}`;
}

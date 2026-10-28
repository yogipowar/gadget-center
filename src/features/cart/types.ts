export type CartLine = {
  slug: string;
  quantity: number;
};

export type CartState = {
  items: CartLine[];
};

export type CheckoutBankDetails = {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
};

export type CheckoutPayment = {
  method: "UPI" | "BANK";
  amount: number;
  orderNumber: string;
  upiId: string;
  upiUri: string | null;
  payeeName: string;
  bank: CheckoutBankDetails;
};

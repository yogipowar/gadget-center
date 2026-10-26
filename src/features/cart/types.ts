export type CartLine = {
  slug: string;
  quantity: number;
};

export type CartState = {
  items: CartLine[];
};

export type CheckoutPayment = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    contact: string;
    email?: string;
  };
};

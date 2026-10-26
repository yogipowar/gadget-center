export type CartLine = {
  slug: string;
  quantity: number;
};

export type CartState = {
  items: CartLine[];
};

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/config/routes";
import { useAdminCatalog } from "@/features/admin/catalog-store";
import type { AdminOrder } from "@/features/admin/types";
import { clearCart, useCart } from "@/features/cart/store";
import { getProductBySlug } from "@/features/catalog/queries";
import { apiClient } from "@/lib/api/client";
import { formatInr } from "@/utils/currency";

type CheckoutFormState = {
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const emptyForm: CheckoutFormState = {
  name: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export function CheckoutForm() {
  const router = useRouter();
  const cart = useCart();
  const catalog = useAdminCatalog();
  const [form, setForm] = useState<CheckoutFormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const lines = cart.items
    .map((item) => {
      const product = getProductBySlug(item.slug, catalog.products);
      if (!product) {
        return null;
      }
      return { product, quantity: item.quantity };
    })
    .filter((line) => line !== null);

  const subtotal = lines.reduce((sum, line) => sum + line.product.salePrice * line.quantity, 0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lines.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    const response = await apiClient.post<AdminOrder>(routes.api.orders, {
      customerName: form.name,
      mobile: form.mobile,
      email: form.email || undefined,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
    });
    setSubmitting(false);
    if (!response.success || !response.data) {
      toast.error(response.message || "Could not place the order.");
      return;
    }
    clearCart();
    toast.success("Order saved. We will call you to confirm.");
    router.push(`${routes.orderSuccess}?order=${encodeURIComponent(response.data.orderNumber)}`);
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add a laptop or accessory before checkout.</p>
        <Link href={routes.products} className="mt-6 inline-block text-sm font-medium underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cash on Delivery. Your order is stored in the shop database and our team will confirm it
          on the mobile number you share.
        </p>
        <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              name="mobile"
              required
              inputMode="numeric"
              maxLength={10}
              value={form.mobile}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  mobile: event.target.value.replace(/\D/g, "").slice(0, 10),
                }))
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              required
              value={form.address}
              onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                required
                value={form.city}
                onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                required
                value={form.state}
                onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              name="pincode"
              required
              value={form.pincode}
              onChange={(event) => setForm((current) => ({ ...current, pincode: event.target.value }))}
            />
          </div>
          <Button type="submit" className="mt-2 h-10" disabled={submitting}>
            {submitting ? "Placing order…" : "Place COD order"}
          </Button>
        </form>
      </div>
      <aside className="h-fit rounded-xl border border-border p-5">
        <h2 className="text-sm font-semibold">Order summary</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex justify-between gap-3">
              <span>
                {quantity} × {product.name}
              </span>
              <span>{formatInr(product.salePrice * quantity, { compact: true })}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-semibold">{formatInr(subtotal, { compact: true })}</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Currently available: Cash on Delivery. Razorpay can be connected to this same checkout
          later.
        </p>
      </aside>
    </div>
  );
}

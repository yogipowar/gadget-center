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
import type { CheckoutPayment } from "@/features/cart/types";
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

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutInstance = {
  open: () => void;
  on: (event: "payment.failed", handler: () => void) => void;
};

type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayCheckoutInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const emptyForm: CheckoutFormState = {
  name: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay checkout."));
    document.body.appendChild(script);
  });
}

export function CheckoutForm() {
  const router = useRouter();
  const cart = useCart();
  const catalog = useAdminCatalog();
  const [form, setForm] = useState<CheckoutFormState>(emptyForm);
  const [agreed, setAgreed] = useState(false);
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

  async function confirmPayment(payload: RazorpaySuccessResponse) {
    const verified = await apiClient.post<AdminOrder>(routes.api.razorpayVerify, payload);
    if (!verified.success || !verified.data) {
      throw new Error(verified.message || "Payment could not be confirmed.");
    }
    clearCart();
    toast.success("Payment received. Your order is confirmed.");
    router.push(`${routes.orderSuccess}?order=${encodeURIComponent(verified.data.orderNumber)}`);
  }

  function openRazorpay(payment: CheckoutPayment) {
    return new Promise<void>((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error("Razorpay checkout is not available."));
        return;
      }
      let settled = false;
      const checkout = new window.Razorpay({
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency,
        name: payment.name,
        description: payment.description,
        order_id: payment.orderId,
        prefill: payment.prefill,
        theme: { color: "#111827" },
        handler: (response: RazorpaySuccessResponse) => {
          if (settled) {
            return;
          }
          settled = true;
          confirmPayment(response).then(resolve).catch(reject);
        },
        modal: {
          ondismiss: () => {
            if (settled) {
              return;
            }
            settled = true;
            reject(new Error("Payment was cancelled."));
          },
        },
      });
      checkout.on("payment.failed", () => {
        if (settled) {
          return;
        }
        settled = true;
        reject(new Error("Payment failed. Try again."));
      });
      checkout.open();
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lines.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!agreed) {
      toast.error("Please accept the Terms, Refund and Shipping policies to continue.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await apiClient.post<{ order: AdminOrder; payment: CheckoutPayment }>(
        routes.api.orders,
        {
          customerName: form.name,
          mobile: form.mobile,
          email: form.email || undefined,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          items: cart.items,
        },
      );
      if (!response.success || !response.data) {
        throw new Error(response.message || "Could not start payment.");
      }
      await loadRazorpayScript();
      await openRazorpay(response.data.payment);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not complete payment.");
    } finally {
      setSubmitting(false);
    }
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
          Pay online with UPI, cards or netbanking. Cash on delivery is not available. The order is
          confirmed only after payment succeeds.
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
          <label className="mt-2 flex items-start gap-2 text-sm leading-5 text-muted-foreground">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              required
            />
            <span>
              I agree to the{" "}
              <Link href={routes.terms} className="underline">
                Terms &amp; Conditions
              </Link>
              ,{" "}
              <Link href={routes.refundPolicy} className="underline">
                Refund &amp; Cancellation Policy
              </Link>{" "}
              and{" "}
              <Link href={routes.shippingPolicy} className="underline">
                Shipping Policy
              </Link>
              .
            </span>
          </label>
          <Button type="submit" className="mt-2 h-10" disabled={submitting || !agreed}>
            {submitting ? "Opening payment…" : `Pay ${formatInr(subtotal, { compact: true })}`}
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
          Online payment only via Razorpay (UPI, cards or netbanking). Prices are in INR. Free
          shipping in India on prepaid orders. See{" "}
          <Link href={routes.shippingPolicy} className="underline">
            Shipping
          </Link>{" "}
          and{" "}
          <Link href={routes.refundPolicy} className="underline">
            Refund &amp; Cancellation
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}

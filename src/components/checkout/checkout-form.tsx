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
import { qrImageUrl, UPI_LIMIT_RUPEES } from "@/lib/upi";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
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

async function copyText(value: string, label: string) {
  await navigator.clipboard.writeText(value);
  toast.success(`${label} copied`);
}

function BankDetails({ payment }: { payment: CheckoutPayment }) {
  const lines = [
    `Name: ${payment.bank.accountName}`,
    `Bank: ${payment.bank.bankName}`,
    `Account: ${payment.bank.accountNumber}`,
    `IFSC: ${payment.bank.ifsc}`,
    `Amount: ${formatInr(payment.amount, { compact: true })}`,
    `Remark: ${payment.orderNumber}`,
  ].join("\n");

  return (
    <div className="rounded-xl border border-border p-4 text-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Bank transfer (IMPS / NEFT)</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => void copyText(lines, "Bank details")}>
          Copy
        </Button>
      </div>
      <dl className="mt-3 space-y-1.5">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Name</dt>
          <dd className="font-medium">{payment.bank.accountName}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Bank</dt>
          <dd className="font-medium">{payment.bank.bankName}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Account</dt>
          <dd className="font-medium">{payment.bank.accountNumber}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">IFSC</dt>
          <dd className="font-medium">{payment.bank.ifsc}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Amount</dt>
          <dd className="font-medium">{formatInr(payment.amount, { compact: true })}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Remark</dt>
          <dd className="font-medium">{payment.orderNumber}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Put the order number in the transfer remark so we can match your payment.
      </p>
    </div>
  );
}

function PaymentStep({
  payment,
  onDone,
}: {
  payment: CheckoutPayment;
  onDone: () => void;
}) {
  const whatsapp = buildWhatsAppUrl(
    `Hi GadgetCenter, I have paid ${formatInr(payment.amount, { compact: true })} for order ${payment.orderNumber}.`,
  );

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Pay for order {payment.orderNumber}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Amount: <span className="font-medium text-foreground">{formatInr(payment.amount, { compact: true })}</span>
        . The order is confirmed after we see the credit in the account.
      </p>

      {payment.method === "UPI" && payment.upiUri ? (
        <div className="mt-6 rounded-xl border border-border p-4">
          <h2 className="text-sm font-semibold">Pay by UPI</h2>
          <p className="mt-1 text-sm text-muted-foreground">Scan this QR or open your UPI app. Amount is already filled.</p>
          <div className="mt-4 flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImageUrl(payment.upiUri)}
              alt="UPI QR code"
              width={240}
              height={240}
              className="rounded-lg border border-border bg-white p-2"
            />
            <p className="text-sm font-medium">{payment.upiId}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => void copyText(payment.upiId, "UPI ID")}>
                Copy UPI ID
              </Button>
              <a href={payment.upiUri} className="inline-flex">
                <Button type="button" size="sm">
                  Open UPI app
                </Button>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          This order is over {formatInr(UPI_LIMIT_RUPEES, { compact: true })}, so UPI cannot be used. Pay by bank
          transfer, or place two smaller orders.
        </p>
      )}

      <div className="mt-4">
        <BankDetails payment={payment} />
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button type="button" className="h-10" onClick={onDone}>
          I have paid
        </Button>
        {whatsapp ? (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">
            <Button type="button" variant="outline" className="h-10">
              Send screenshot on WhatsApp
            </Button>
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const cart = useCart();
  const catalog = useAdminCatalog();
  const [form, setForm] = useState<CheckoutFormState>(emptyForm);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [payment, setPayment] = useState<CheckoutPayment | null>(null);

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
  const upiAllowed = subtotal <= UPI_LIMIT_RUPEES;

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
        throw new Error(response.message || "Could not place the order.");
      }
      setPayment(response.data.payment);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place the order.");
    } finally {
      setSubmitting(false);
    }
  }

  function finishPayment() {
    const orderNumber = payment?.orderNumber;
    clearCart();
    toast.success("Thanks. We will confirm the order after the payment appears.");
    router.push(
      orderNumber
        ? `${routes.orderSuccess}?order=${encodeURIComponent(orderNumber)}`
        : routes.orderSuccess,
    );
  }

  if (payment) {
    return <PaymentStep payment={payment} onDone={finishPayment} />;
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
          {upiAllowed
            ? "Pay with UPI (scan QR or UPI ID). Bank transfer is also available. Cash on delivery is not offered."
            : `This cart is over ${formatInr(UPI_LIMIT_RUPEES, { compact: true })}, so pay by bank transfer (IMPS/NEFT) or split into smaller orders.`}
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
            {submitting
              ? "Placing order…"
              : upiAllowed
                ? `Continue to UPI · ${formatInr(subtotal, { compact: true })}`
                : `Continue to bank transfer · ${formatInr(subtotal, { compact: true })}`}
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
          {upiAllowed
            ? "UPI up to ₹1 lakh. Pay to the UPI ID / QR shown next. We confirm the order after the money arrives."
            : "UPI is blocked above ₹1 lakh. Use IMPS/NEFT to the Bank of Maharashtra account shown next."}
        </p>
      </aside>
    </div>
  );
}

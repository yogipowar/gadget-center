"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginCustomer, loadCustomerAccount, logoutCustomer, type CustomerAccount } from "@/features/account/account-client";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  formatAdminDate,
} from "@/features/admin/labels";
import type { AdminOrder } from "@/features/admin/types";
import { formatInr } from "@/utils/currency";

function paymentLabel(order: AdminOrder) {
  if (order.paymentStatus === "PAID") {
    return { value: "PAID", label: PAYMENT_STATUS_LABELS.PAID };
  }
  if (order.paymentReported) {
    return { value: "REPORTED", label: "Payment reported" };
  }
  return { value: order.paymentStatus, label: PAYMENT_STATUS_LABELS[order.paymentStatus] };
}

function OrderCard({ order }: { order: AdminOrder }) {
  const payment = paymentLabel(order);
  return (
    <article className="rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{order.orderNumber}</p>
          <p className="mt-1 text-xs text-muted-foreground">{formatAdminDate(order.createdAt)}</p>
        </div>
        <p className="font-semibold text-foreground">{formatInr(order.total, { compact: true })}</p>
      </div>
      <p className="mt-3 text-sm text-zinc-700">{order.items}</p>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Order</dt>
          <dd className="mt-1">
            <StatusBadge value={order.status} label={ORDER_STATUS_LABELS[order.status]} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Payment</dt>
          <dd className="mt-1">
            <StatusBadge value={payment.value} label={payment.label} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Method</dt>
          <dd className="mt-1">
            <StatusBadge value={order.paymentMethod} label={PAYMENT_METHOD_LABELS[order.paymentMethod]} />
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function AccountScreen({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [account, setAccount] = useState<CustomerAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mobile, setMobile] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    void loadCustomerAccount()
      .then((next) => setAccount(next))
      .finally(() => setLoading(false));
  }, []);

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const next = await loginCustomer(mobile, orderNumber);
      setAccount(next);
      toast.success("Signed in. Your order status is below.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onLogout() {
    await logoutCustomer();
    setAccount(null);
    toast.success("Signed out.");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {account ? (
          <Button type="button" variant="outline" size="sm" onClick={() => void onLogout()}>
            Sign out
          </Button>
        ) : null}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading account…</p>
      ) : account ? (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-zinc-700">
            Signed in as <span className="font-medium">{account.session.name}</span> · {account.session.mobile}
          </p>
          {account.orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet for this mobile number.</p>
          ) : (
            account.orders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      ) : (
        <form className="mt-8 grid max-w-md gap-3" onSubmit={(event) => void onLogin(event)}>
          <div className="grid gap-1.5">
            <Label htmlFor="account-mobile">Mobile</Label>
            <Input
              id="account-mobile"
              inputMode="numeric"
              maxLength={10}
              required
              value={mobile}
              onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="account-order">Order number</Label>
            <Input
              id="account-order"
              required
              placeholder="GC-ORD-12345678"
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
            />
          </div>
          <Button type="submit" className="mt-2 h-10" disabled={submitting}>
            {submitting ? "Checking…" : "Check order status"}
          </Button>
        </form>
      )}
    </div>
  );
}

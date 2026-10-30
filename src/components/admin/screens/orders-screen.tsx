"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminOrders } from "@/features/admin/orders-client";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  formatAdminDate,
} from "@/features/admin/labels";
import type { AdminOrder } from "@/features/admin/types";
import { formatPhone, telHref } from "@/lib/contact";
import { formatInr } from "@/utils/currency";

function paymentBadge(order: AdminOrder) {
  if (order.paymentStatus === "PAID") {
    return <StatusBadge value="PAID" label={PAYMENT_STATUS_LABELS.PAID} />;
  }
  if (order.paymentReported) {
    return <StatusBadge value="REPORTED" label="Payment reported" />;
  }
  return <StatusBadge value={order.paymentStatus} label={PAYMENT_STATUS_LABELS[order.paymentStatus]} />;
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  );
}

function OrderDetails({
  order,
  onClose,
  onMarkPaid,
}: {
  order: AdminOrder;
  onClose: () => void;
  onMarkPaid: (order: AdminOrder) => void;
}) {
  const address = [order.address, order.city, order.state, order.pincode].filter(Boolean).join(", ");
  const lines = order.lineItems?.length
    ? order.lineItems
    : [{ name: order.items, slug: "", quantity: 1, unitPrice: order.total }];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl" showCloseButton>
        <DialogHeader>
          <DialogTitle>{order.orderNumber}</DialogTitle>
          <DialogDescription>Placed {formatAdminDate(order.createdAt)}</DialogDescription>
        </DialogHeader>
        <dl className="grid gap-3 text-sm">
          <DetailRow label="Order status">
            <StatusBadge value={order.status} label={ORDER_STATUS_LABELS[order.status]} />
          </DetailRow>
          <DetailRow label="Payment">{paymentBadge(order)}</DetailRow>
          <DetailRow label="Method">
            <StatusBadge value={order.paymentMethod} label={PAYMENT_METHOD_LABELS[order.paymentMethod]} />
          </DetailRow>
          <DetailRow label="Customer">{order.customer}</DetailRow>
          <DetailRow label="Mobile">
            <a className="font-medium text-brand-blue hover:underline" href={telHref(order.mobile)}>
              {formatPhone(order.mobile)}
            </a>
          </DetailRow>
          {order.email ? (
            <DetailRow label="Email">
              <a className="text-brand-blue hover:underline" href={`mailto:${order.email}`}>
                {order.email}
              </a>
            </DetailRow>
          ) : null}
          <DetailRow label="Shipping address">{address || "—"}</DetailRow>
        </dl>
        <div>
          <p className="mb-2 text-sm font-medium">Items</p>
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-1 pr-2 font-medium">Product</th>
                <th className="py-1 pr-2 font-medium">Qty</th>
                <th className="py-1 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => (
                <tr key={`${line.slug}-${index}`} className="border-t border-border">
                  <td className="py-2 pr-2">{line.name}</td>
                  <td className="py-2 pr-2">{line.quantity}</td>
                  <td className="py-2 text-right">
                    {formatInr(line.unitPrice * line.quantity, { compact: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold">
            <span>Total</span>
            <span>{formatInr(order.total, { compact: true })}</span>
          </p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          {order.paymentStatus === "PENDING" ? (
            <Button type="button" onClick={() => onMarkPaid(order)}>
              Mark paid
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OrdersScreen() {
  const { orders, loaded, error, markPaid } = useAdminOrders();
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  async function onMarkPaid(order: AdminOrder) {
    try {
      const updated = await markPaid(order.id);
      toast.success(`${order.orderNumber} marked as paid.`);
      setSelected((current) => (current?.id === order.id ? updated : current));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the order.");
    }
  }

  return (
    <AdminPage title="Orders" description="Open an order to see customer, shipping and item details. Mark paid after you see the credit.">
      <AdminTable
        rows={orders}
        searchPlaceholder="Search order number, customer or mobile"
        searchText={(row) => `${row.orderNumber} ${row.customer} ${row.mobile} ${row.email ?? ""} ${row.items}`}
        empty={
          !loaded
            ? "Loading orders…"
            : error
              ? "Could not load orders. Refresh the page."
              : "No orders yet."
        }
        onRowClick={(row) => setSelected(row)}
        columns={[
          {
            header: "Order",
            cell: (row: AdminOrder) => (
              <button
                type="button"
                className="font-medium text-brand-blue hover:underline"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected(row);
                }}
              >
                {row.orderNumber}
              </button>
            ),
          },
          { header: "Customer", cell: (row: AdminOrder) => row.customer },
          { header: "Mobile", cell: (row: AdminOrder) => row.mobile },
          {
            header: "Items",
            className: "max-w-[220px] whitespace-normal",
            cell: (row: AdminOrder) => <span className="line-clamp-2">{row.items}</span>,
          },
          { header: "Total", cell: (row: AdminOrder) => formatInr(row.total, { compact: true }) },
          {
            header: "Status",
            cell: (row: AdminOrder) => (
              <StatusBadge value={row.status} label={ORDER_STATUS_LABELS[row.status]} />
            ),
          },
          {
            header: "Payment",
            cell: (row: AdminOrder) => paymentBadge(row),
          },
          { header: "Date", cell: (row: AdminOrder) => formatAdminDate(row.createdAt) },
          {
            header: "",
            className: "sticky right-0 bg-card text-right shadow-[-8px_0_8px_-8px_rgba(15,23,42,0.12)]",
            cell: (row: AdminOrder) => (
              <div className="flex justify-end gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelected(row);
                  }}
                >
                  View
                </Button>
                {row.paymentStatus === "PENDING" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={(event) => {
                      event.stopPropagation();
                      void onMarkPaid(row);
                    }}
                  >
                    Mark paid
                  </Button>
                ) : null}
              </div>
            ),
          },
        ]}
      />
      {selected ? (
        <OrderDetails order={selected} onClose={() => setSelected(null)} onMarkPaid={(order) => void onMarkPaid(order)} />
      ) : null}
    </AdminPage>
  );
}

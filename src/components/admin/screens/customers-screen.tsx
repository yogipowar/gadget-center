"use client";

import { useMemo, useState } from "react";

import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminCustomers, adminEnquiries, adminLeads, adminOrders } from "@/features/admin/fixtures";
import {
  ENQUIRY_STATUS_LABELS,
  LEAD_STATUS_LABELS,
  ORDER_STATUS_LABELS,
  formatAdminDate,
} from "@/features/admin/labels";
import type { AdminCustomer } from "@/features/admin/types";
import { formatInr } from "@/utils/currency";

export function CustomersScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(adminCustomers[0]?.id ?? null);
  const selected = adminCustomers.find((customer) => customer.id === selectedId) ?? null;
  const history = useMemo(() => {
    if (!selected) {
      return { orders: [], enquiries: [], leads: [] };
    }
    const match = (name: string, mobile: string) =>
      name === selected.name || mobile === selected.mobile;
    return {
      orders: adminOrders.filter((order) => match(order.customer, order.mobile)),
      enquiries: adminEnquiries.filter((enquiry) => match(enquiry.name, enquiry.mobile)),
      leads: adminLeads.filter((lead) => match(lead.name, lead.mobile)),
    };
  }, [selected]);

  return (
    <AdminPage
      title="Customers"
      description="Sample buyers and history on this device. Order and lead history will come from the database later."
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <AdminTable
          rows={adminCustomers}
          searchPlaceholder="Search name, mobile, email or city"
          searchText={(row) => `${row.name} ${row.mobile} ${row.email} ${row.city}`}
          empty="No customers match this search."
          columns={[
            { header: "Name", cell: (row: AdminCustomer) => row.name },
            { header: "Mobile", cell: (row: AdminCustomer) => row.mobile },
            { header: "City", cell: (row: AdminCustomer) => row.city },
            { header: "Orders", cell: (row: AdminCustomer) => row.orders },
            { header: "Spend", cell: (row: AdminCustomer) => formatInr(row.totalSpend, { compact: true }) },
            { header: "Last order", cell: (row: AdminCustomer) => formatAdminDate(row.lastOrderAt) },
            {
              header: "History",
              className: "text-right",
              cell: (row: AdminCustomer) => (
                <div className="flex justify-end">
                  <Button
                    variant={row.id === selectedId ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedId(row.id)}
                  >
                    View
                  </Button>
                </div>
              ),
            },
          ]}
        />

        <Card>
          <CardHeader className="border-b">
            <CardTitle>{selected ? selected.name : "Customer history"}</CardTitle>
            <CardDescription>
              {selected
                ? `${selected.city} · ${selected.mobile} · ${selected.email}`
                : "Select a customer to see orders, enquiries and leads."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {selected ? (
              <>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Orders</p>
                    <p className="font-medium">{selected.orders}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Spend</p>
                    <p className="font-medium">{formatInr(selected.totalSpend, { compact: true })}</p>
                  </div>
                </div>

                <section>
                  <h3 className="text-sm font-semibold">Orders</h3>
                  {history.orders.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">No orders on file.</p>
                  ) : (
                    <ul className="mt-2 space-y-3">
                      {history.orders.map((order) => (
                        <li key={order.id} className="rounded-lg border border-border p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium">{order.orderNumber}</p>
                              <p className="text-xs text-muted-foreground">{order.items}</p>
                            </div>
                            <StatusBadge value={order.status} label={ORDER_STATUS_LABELS[order.status]} />
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {formatInr(order.total, { compact: true })} · {formatAdminDate(order.createdAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <h3 className="text-sm font-semibold">Enquiries</h3>
                  {history.enquiries.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">No enquiries on file.</p>
                  ) : (
                    <ul className="mt-2 space-y-3">
                      {history.enquiries.map((enquiry) => (
                        <li key={enquiry.id} className="text-sm">
                          <p className="font-medium">{enquiry.product}</p>
                          <p className="text-xs text-muted-foreground">
                            {enquiry.channel} · {ENQUIRY_STATUS_LABELS[enquiry.status]} ·{" "}
                            {formatAdminDate(enquiry.createdAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <h3 className="text-sm font-semibold">Leads</h3>
                  {history.leads.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">No leads on file.</p>
                  ) : (
                    <ul className="mt-2 space-y-3">
                      {history.leads.map((lead) => (
                        <li key={lead.id} className="text-sm">
                          <p className="font-medium">{lead.leadNumber}</p>
                          <p className="text-xs text-muted-foreground">{lead.notes}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {LEAD_STATUS_LABELS[lead.status]} · {formatAdminDate(lead.createdAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Select a customer from the table.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPage>
  );
}

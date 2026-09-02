"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { AdminPage } from "@/components/admin/admin-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";

export function SettingsScreen() {
  const [form, setForm] = useState({
    name: siteConfig.name,
    orderPhone: siteConfig.contact.orderPhone,
    repairPhone: siteConfig.contact.repairPhone,
    email: siteConfig.contact.email,
    address: siteConfig.contact.address,
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    toast.success("Saved on this screen only. Storefront contact still comes from site settings.");
  }

  return (
    <AdminPage title="Settings" description="Business profile shown to staff. Storefront values still come from environment / site config.">
      <form className="max-w-xl space-y-3 rounded-xl border border-border bg-card p-5" onSubmit={onSubmit}>
        <div className="grid gap-1.5">
          <Label htmlFor="store-name">Store name</Label>
          <Input
            id="store-name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="order-phone">Orders phone</Label>
            <Input
              id="order-phone"
              value={form.orderPhone}
              onChange={(event) => setForm((current) => ({ ...current, orderPhone: event.target.value }))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="repair-phone">Repair phone</Label>
            <Input
              id="repair-phone"
              value={form.repairPhone}
              onChange={(event) => setForm((current) => ({ ...current, repairPhone: event.target.value }))}
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="store-email">Email</Label>
          <Input
            id="store-email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="store-address">Address</Label>
          <Textarea
            id="store-address"
            rows={3}
            value={form.address}
            onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
          />
        </div>
        <Button type="submit" className="h-10">
          Save
        </Button>
      </form>
    </AdminPage>
  );
}

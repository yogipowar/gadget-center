import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cash on Delivery and order requests. Online payment can be added later without changing
          this flow.
        </p>
        <form className="mt-6 grid gap-3" action={routes.contact}>
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="mobile">Mobile</Label>
            <Input id="mobile" name="mobile" required inputMode="numeric" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" required />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" name="pincode" required />
          </div>
          <Link href={routes.contact} className={cn(buttonVariants(), "mt-2 h-10")}>
            Place order request
          </Link>
        </form>
      </div>
      <aside className="rounded-xl border border-border p-5 h-fit">
        <h2 className="text-sm font-semibold">Payment</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Currently available: Cash on Delivery and enquiry / order request. Razorpay can be
          connected to this same checkout later.
        </p>
      </aside>
    </div>
  );
}

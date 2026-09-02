"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LEAD_INTEREST_LABELS,
  LEAD_INTEREST_OPTIONS,
  type LeadInterest,
} from "@/constants/leads";
import { LOCAL_STORAGE_KEYS } from "@/constants/storage";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { createLeadSchema } from "@/validators/lead";

type LeadCaptureDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormState = {
  name: string;
  mobile: string;
  address: string;
  interestedCategory: LeadInterest | "";
};

const emptyForm: FormState = {
  name: "",
  mobile: "",
  address: "",
  interestedCategory: "",
};

export function LeadCaptureDialog({ open, onOpenChange }: LeadCaptureDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});

    const parsed = createLeadSchema.safeParse({
      name: form.name,
      mobile: form.mobile,
      address: form.address,
      interestedCategory: form.interestedCategory || undefined,
    });

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);
      setSubmitting(false);
      return;
    }

    const interest = parsed.data.interestedCategory
      ? LEAD_INTEREST_LABELS[parsed.data.interestedCategory]
      : "a product";
    const whatsapp = buildWhatsAppUrl(
      [
        "Hi GadgetCenter, I need help choosing a product.",
        `Name: ${parsed.data.name}`,
        `Mobile: ${parsed.data.mobile}`,
        `Address: ${parsed.data.address}`,
        `Interested in: ${interest}`,
      ].join("\n"),
    );

    window.localStorage.setItem(LOCAL_STORAGE_KEYS.leadSubmitted, "1");
    document.cookie = `${LOCAL_STORAGE_KEYS.leadSubmitted}=1; path=/; max-age=15552000; samesite=lax`;
    toast.success("Thanks. Continue on WhatsApp or browse the store.");
    setForm(emptyForm);
    setSubmitting(false);
    onOpenChange(false);

    if (whatsapp) {
      window.open(whatsapp, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find the Right Laptop for You</DialogTitle>
          <DialogDescription>
            Tell us your details and our team will help you choose the best option.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <div className="grid gap-1.5">
            <Label htmlFor="lead-name">Full Name</Label>
            <Input
              id="lead-name"
              value={form.name}
              autoComplete="name"
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
            {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lead-mobile">Mobile Number</Label>
            <Input
              id="lead-mobile"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              placeholder="10-digit mobile"
              value={form.mobile}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  mobile: event.target.value.replace(/\D/g, "").slice(0, 10),
                }))
              }
            />
            {errors.mobile ? <p className="text-xs text-destructive">{errors.mobile}</p> : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lead-address">Address</Label>
            <Textarea
              id="lead-address"
              rows={3}
              value={form.address}
              onChange={(event) =>
                setForm((current) => ({ ...current, address: event.target.value }))
              }
            />
            {errors.address ? <p className="text-xs text-destructive">{errors.address}</p> : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lead-interest">Interested In</Label>
            <select
              id="lead-interest"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={form.interestedCategory}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  interestedCategory: event.target.value as LeadInterest | "",
                }))
              }
            >
              <option value="">Select a category</option>
              {LEAD_INTEREST_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {LEAD_INTEREST_LABELS[option]}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" className="mt-1 h-10" disabled={submitting}>
            {submitting ? "Opening WhatsApp..." : "Continue Shopping"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

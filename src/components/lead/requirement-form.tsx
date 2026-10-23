"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LEAD_INTEREST_LABELS,
  LEAD_INTEREST_OPTIONS,
  type LeadInterest,
} from "@/constants/leads";
import { LOCAL_STORAGE_KEYS } from "@/constants/storage";
import { createLeadSchema } from "@/validators/lead";

type FormState = {
  name: string;
  mobile: string;
  address: string;
  interestedCategory: LeadInterest | "";
  requirement: string;
};

const emptyForm: FormState = {
  name: "",
  mobile: "",
  address: "",
  interestedCategory: "",
  requirement: "",
};

type RequirementFormProps = {
  idPrefix: string;
  submitLabel?: string;
  onSubmitted?: () => void;
};

export function RequirementForm({
  idPrefix,
  submitLabel = "Submit requirement",
  onSubmitted,
}: RequirementFormProps) {
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
      requirement: form.requirement || undefined,
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

    window.localStorage.setItem(LOCAL_STORAGE_KEYS.leadSubmitted, "1");
    document.cookie = `${LOCAL_STORAGE_KEYS.leadSubmitted}=1; path=/; max-age=15552000; samesite=lax`;
    toast.success("Thanks. Our team will contact you shortly.");
    setForm(emptyForm);
    setSubmitting(false);
    onSubmitted?.();
  }

  return (
    <form className="grid gap-3" autoComplete="off" onSubmit={onSubmit}>
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-name`}>Full Name</Label>
        <Input
          id={`${idPrefix}-name`}
          name={`${idPrefix}-name`}
          value={form.name}
          autoComplete="off"
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
        {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-mobile`}>Mobile Number</Label>
        <Input
          id={`${idPrefix}-mobile`}
          name={`${idPrefix}-mobile`}
          inputMode="numeric"
          autoComplete="off"
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
        <Label htmlFor={`${idPrefix}-address`}>Address</Label>
        <Textarea
          id={`${idPrefix}-address`}
          name={`${idPrefix}-address`}
          rows={3}
          autoComplete="off"
          value={form.address}
          onChange={(event) =>
            setForm((current) => ({ ...current, address: event.target.value }))
          }
        />
        {errors.address ? <p className="text-xs text-destructive">{errors.address}</p> : null}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-interest`}>Interested In</Label>
        <select
          id={`${idPrefix}-interest`}
          name={`${idPrefix}-interest`}
          autoComplete="off"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          value={form.interestedCategory}
          suppressHydrationWarning
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
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-requirement`}>Your requirement</Label>
        <Textarea
          id={`${idPrefix}-requirement`}
          rows={3}
          placeholder="Budget, use-case, preferred brand or specs"
          value={form.requirement}
          onChange={(event) =>
            setForm((current) => ({ ...current, requirement: event.target.value }))
          }
        />
        {errors.requirement ? <p className="text-xs text-destructive">{errors.requirement}</p> : null}
      </div>
      <Button type="submit" className="mt-1 h-10" disabled={submitting}>
        {submitting ? "Submitting..." : submitLabel}
      </Button>
    </form>
  );
}

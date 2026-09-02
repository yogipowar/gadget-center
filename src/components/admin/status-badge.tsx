"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  NEW: "bg-sky-100 text-sky-800",
  CONTACTED: "bg-indigo-100 text-indigo-800",
  INTERESTED: "bg-violet-100 text-violet-800",
  FOLLOW_UP: "bg-amber-100 text-amber-900",
  QUOTATION_SENT: "bg-orange-100 text-orange-800",
  CONVERTED: "bg-emerald-100 text-emerald-800",
  NOT_INTERESTED: "bg-muted text-muted-foreground",
  LOST: "bg-rose-100 text-rose-800",
  HOT: "bg-rose-100 text-rose-800",
  WARM: "bg-amber-100 text-amber-900",
  COLD: "bg-slate-100 text-slate-700",
  PENDING: "bg-amber-100 text-amber-900",
  CONFIRMED: "bg-sky-100 text-sky-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  PACKED: "bg-violet-100 text-violet-800",
  SHIPPED: "bg-cyan-100 text-cyan-800",
  OUT_FOR_DELIVERY: "bg-teal-100 text-teal-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-800",
  RETURN_REQUESTED: "bg-orange-100 text-orange-800",
  RETURNED: "bg-muted text-muted-foreground",
  PAID: "bg-emerald-100 text-emerald-800",
  FAILED: "bg-rose-100 text-rose-800",
  REFUNDED: "bg-muted text-muted-foreground",
  COD_PENDING: "bg-amber-100 text-amber-900",
  OPEN: "bg-sky-100 text-sky-800",
  REPLIED: "bg-indigo-100 text-indigo-800",
  CLOSED: "bg-muted text-muted-foreground",
  ACTIVE: "bg-emerald-100 text-emerald-800",
  INVITED: "bg-amber-100 text-amber-900",
  AVAILABLE: "bg-emerald-100 text-emerald-800",
  RESERVED: "bg-amber-100 text-amber-900",
  SOLD: "bg-muted text-muted-foreground",
  IN_TESTING: "bg-indigo-100 text-indigo-800",
  IN_REFURBISHMENT: "bg-orange-100 text-orange-800",
  UNAVAILABLE: "bg-rose-100 text-rose-800",
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  HIDDEN: "bg-muted text-muted-foreground",
};

export function StatusBadge({ value, label }: { value: string; label: string }) {
  return (
    <Badge variant="secondary" className={cn("border-0 font-medium", tones[value] ?? "bg-muted")}>
      {label}
    </Badge>
  );
}

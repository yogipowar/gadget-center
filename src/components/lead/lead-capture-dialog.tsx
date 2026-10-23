"use client";

import { RequirementForm } from "@/components/lead/requirement-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LeadCaptureDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LeadCaptureDialog({ open, onOpenChange }: LeadCaptureDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find the Right Laptop for You</DialogTitle>
          <DialogDescription>
            Tell us your details and our team will help you choose the best option.
          </DialogDescription>
        </DialogHeader>
        <RequirementForm
          idPrefix="lead"
          submitLabel="Continue Shopping"
          onSubmitted={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

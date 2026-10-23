"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { LeadCaptureDialog } from "@/components/lead/lead-capture-dialog";
import { captureAttributionFromWindow } from "@/lib/tracking/client-attribution";

type LeadCaptureContextValue = {
  openLeadCapture: () => void;
};

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);

export function LeadCaptureProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openLeadCapture = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ openLeadCapture }), [openLeadCapture]);

  useEffect(() => {
    captureAttributionFromWindow();
  }, []);

  return (
    <LeadCaptureContext.Provider value={value}>
      {children}
      {open ? <LeadCaptureDialog open={open} onOpenChange={setOpen} /> : null}
    </LeadCaptureContext.Provider>
  );
}

export function useLeadCapture() {
  const context = useContext(LeadCaptureContext);
  if (!context) {
    throw new Error("useLeadCapture must be used within LeadCaptureProvider");
  }
  return context;
}

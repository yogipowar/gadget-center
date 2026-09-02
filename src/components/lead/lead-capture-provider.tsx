"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { LeadCaptureDialog } from "@/components/lead/lead-capture-dialog";
import { LOCAL_STORAGE_KEYS } from "@/constants/storage";
import { captureAttributionFromWindow } from "@/lib/tracking/client-attribution";

type LeadCaptureContextValue = {
  openLeadCapture: () => void;
};

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);

export function LeadCaptureProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openLeadCapture = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ openLeadCapture }), [openLeadCapture]);

  return (
    <LeadCaptureContext.Provider value={value}>
      {children}
      <LeadCaptureDialog open={open} onOpenChange={setOpen} />
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

export function HomeLeadGate() {
  const { openLeadCapture } = useLeadCapture();

  useEffect(() => {
    captureAttributionFromWindow();
    if (window.localStorage.getItem(LOCAL_STORAGE_KEYS.leadSubmitted)) {
      return;
    }
    const timer = window.setTimeout(() => openLeadCapture(), 700);
    return () => window.clearTimeout(timer);
  }, [openLeadCapture]);

  return null;
}

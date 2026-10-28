"use client";

import { useEffect, useState } from "react";

import { useLeadCapture } from "@/components/lead/lead-capture-provider";

type ExpertHelpButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export function ExpertHelpButton({ className, children }: ExpertHelpButtonProps) {
  const { openLeadCapture } = useLeadCapture();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className={className} aria-hidden>
        {children}
      </span>
    );
  }

  return (
    <button type="button" className={className} onClick={openLeadCapture} suppressHydrationWarning>
      {children}
    </button>
  );
}

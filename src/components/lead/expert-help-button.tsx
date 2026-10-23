"use client";

import { useLeadCapture } from "@/components/lead/lead-capture-provider";

type ExpertHelpButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export function ExpertHelpButton({ className, children }: ExpertHelpButtonProps) {
  const { openLeadCapture } = useLeadCapture();

  return (
    <button type="button" className={className} onClick={openLeadCapture}>
      {children}
    </button>
  );
}

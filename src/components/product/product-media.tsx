import { Laptop } from "lucide-react";

import { cn } from "@/lib/utils";

const accentClass: Record<"navy" | "slate" | "teal" | "stone", string> = {
  navy: "bg-slate-900",
  slate: "bg-zinc-800",
  teal: "bg-teal-950",
  stone: "bg-stone-800",
};

type ProductMediaProps = {
  accent: keyof typeof accentClass;
  name: string;
  className?: string;
};

export function ProductMedia({ accent, name, className }: ProductMediaProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] items-center justify-center",
        accentClass[accent],
        className,
      )}
    >
      <Laptop className="size-16 text-white/80 sm:size-20" strokeWidth={1.25} />
      <span className="sr-only">{name}</span>
    </div>
  );
}

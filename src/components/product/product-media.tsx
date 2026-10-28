import { Laptop } from "lucide-react";

import { StoreImage } from "@/components/product/store-image";
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
  image?: string;
  className?: string;
  compact?: boolean;
};

export function ProductMedia({
  accent,
  name,
  image,
  className,
  compact = false,
}: ProductMediaProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        compact ? "aspect-square" : "aspect-[4/3]",
        image ? "bg-zinc-100" : accentClass[accent],
        className,
      )}
    >
      {image ? (
        <StoreImage
          src={image}
          alt={name}
          fill
          sizes={compact ? "(max-width: 1024px) 50vw, 240px" : "(max-width: 1024px) 100vw, 560px"}
          className="object-contain"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <Laptop
            className={cn("text-white/80", compact ? "size-9 sm:size-11" : "size-16 sm:size-20")}
            strokeWidth={1.25}
          />
        </div>
      )}
    </div>
  );
}

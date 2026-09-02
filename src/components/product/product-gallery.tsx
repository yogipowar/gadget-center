"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ProductMedia } from "@/components/product/product-media";
import { cn } from "@/lib/utils";

const LENS = 0.42;
const ZOOM = 1 / LENS;

type ProductGalleryProps = {
  images: string[];
  name: string;
  accent: "navy" | "slate" | "teal" | "stone";
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function canHoverZoom() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (min-width: 1024px)").matches
  );
}

export function ProductGallery({ images, name, accent }: ProductGalleryProps) {
  const shots = images.filter(Boolean);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const [stageSize, setStageSize] = useState({ width: 480, height: 360 });

  useEffect(() => {
    setActive(0);
    setZooming(false);
  }, [name, shots[0]]);

  const current = shots[active];
  const lensLeft = clamp(pointer.x - LENS / 2, 0, 1 - LENS);
  const lensTop = clamp(pointer.y - LENS / 2, 0, 1 - LENS);

  function updatePointer(event: React.MouseEvent<HTMLDivElement>) {
    if (!canHoverZoom()) {
      return;
    }
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) {
      return;
    }
    setStageSize({ width: rect.width, height: rect.height });
    setPointer({
      x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
      y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
    });
    setZooming(true);
  }

  function go(delta: number) {
    if (shots.length < 2) {
      return;
    }
    setActive((index) => (index + delta + shots.length) % shots.length);
  }

  return (
    <div className="relative z-20 flex flex-col gap-3 lg:flex-row lg:items-start">
      {shots.length > 1 ? (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:w-[4.75rem] lg:flex-col lg:overflow-visible lg:pb-0">
          {shots.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onMouseEnter={() => {
                setActive(index);
                setZooming(false);
              }}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border bg-zinc-100 transition-colors",
                index === active
                  ? "border-foreground ring-1 ring-foreground"
                  : "border-border hover:border-foreground/40",
              )}
              aria-label={`${name} image ${index + 1} of ${shots.length}`}
              aria-current={index === active}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="relative order-1 min-w-0 flex-1 lg:order-2">
        <div className="overflow-hidden rounded-xl border border-border bg-zinc-100">
          {current ? (
            <div
              ref={stageRef}
              className="relative aspect-[4/3] min-h-64 cursor-crosshair"
              onMouseEnter={updatePointer}
              onMouseMove={updatePointer}
              onMouseLeave={() => setZooming(false)}
            >
              <Image
                src={current}
                alt={`${name}, view ${active + 1}`}
                fill
                preload={active === 0}
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-contain p-3 sm:p-5"
              />
              {zooming ? (
                <div
                  className="pointer-events-none absolute hidden border border-foreground/25 bg-background/35 shadow-sm lg:block"
                  style={{
                    width: `${LENS * 100}%`,
                    height: `${LENS * 100}%`,
                    left: `${lensLeft * 100}%`,
                    top: `${lensTop * 100}%`,
                  }}
                />
              ) : null}
              {shots.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    onMouseEnter={() => setZooming(false)}
                    className="absolute top-1/2 left-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    onMouseEnter={() => setZooming(false)}
                    className="absolute top-1/2 right-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                  <p className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-foreground/75 px-2 py-0.5 text-[11px] font-medium text-background">
                    {active + 1} / {shots.length}
                  </p>
                </>
              ) : null}
            </div>
          ) : (
            <ProductMedia accent={accent} name={name} className="aspect-[4/3] min-h-64" />
          )}
        </div>
        {!zooming && current ? (
          <p className="mt-2 hidden text-xs text-muted-foreground lg:block">Hover the image to zoom</p>
        ) : null}
      </div>

      {zooming && current ? (
        <div
          className="pointer-events-none absolute top-0 left-full z-40 ml-8 hidden overflow-hidden rounded-xl border border-border bg-zinc-100 shadow-xl lg:block"
          style={{ width: stageSize.width, height: stageSize.height }}
          aria-hidden
        >
          <div className="relative h-full w-full overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${ZOOM})`,
                transformOrigin: `${lensLeft * 100 + (LENS * 100) / 2}% ${lensTop * 100 + (LENS * 100) / 2}%`,
              }}
            >
              <Image
                src={current}
                alt=""
                fill
                sizes="1200px"
                className="object-contain p-3 sm:p-5"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

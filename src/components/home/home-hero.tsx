"use client";

import Image from "next/image";
import Link from "next/link";

import { useLeadCapture } from "@/components/lead/lead-capture-provider";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function HomeHero() {
  const { openLeadCapture } = useLeadCapture();

  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div>
          <p className="text-sm font-medium text-background/70">
            Laptops · Desktops · Printers · UPS · CCTV
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-background/75 sm:text-lg">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={routes.laptops}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 bg-background px-5 text-foreground hover:bg-background/90",
              )}
            >
              Shop Laptops
            </Link>
            <Link
              href={routes.refurbishedLaptops}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-background/30 bg-transparent px-5 text-background hover:bg-background/10 hover:text-background",
              )}
            >
              Explore Refurbished
            </Link>
            <button
              type="button"
              onClick={openLeadCapture}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-11 px-5 text-background hover:bg-background/10 hover:text-background",
              )}
            >
              Get Expert Help
            </button>
          </div>
        </div>
        <div className="hero-stage relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="pointer-events-none absolute inset-[10%] rounded-full bg-background/12 blur-3xl" />
          <div className="hero-float relative z-10">
            <Image
              src="/hero-laptop-3d.png"
              alt="Laptop for sale at GadgetCenter"
              width={720}
              height={720}
              preload
              sizes="(max-width: 1024px) 90vw, 480px"
              className="relative h-auto w-full"
            />
          </div>
          <div className="hero-ground-shadow pointer-events-none absolute bottom-[8%] left-1/2 z-0 h-12 w-[55%] -translate-x-1/2 rounded-[100%] bg-black/80 blur-2xl" />
        </div>
      </div>
    </section>
  );
}

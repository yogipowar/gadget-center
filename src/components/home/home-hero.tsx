"use client";

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
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-16">
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
        <div className="rounded-2xl border border-background/15 bg-background/5 p-6">
          <p className="text-sm font-medium">What we help you buy</p>
          <ul className="mt-4 space-y-3 text-sm text-background/75">
            <li>New laptops with current-generation processors</li>
            <li>Refurbished business laptops with visible grades</li>
            <li>Desktops, custom PCs, printers, UPS and accessories</li>
            <li>CCTV, networking, appliances, audio and robotics</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

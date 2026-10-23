import Image from "next/image";
import Link from "next/link";

import { ExpertHelpButton } from "@/components/lead/expert-help-button";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";

export function HomeHero() {
  return (
    <section className="bg-brand-gradient text-white">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-16">
        <div className="order-2 lg:order-1">
          <p className="text-sm font-medium text-sky-200">
            Refurbished Dell &amp; HP · Adapter included · Bulk orders welcome
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={routes.refurbishedLaptops}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 bg-white px-5 text-brand-navy hover:bg-zinc-100 hover:text-brand-navy",
              )}
            >
              Shop Laptops
            </Link>
            <Link
              href={routes.refurbishedLaptops}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-white/30 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white",
              )}
            >
              Explore Refurbished
            </Link>
            <ExpertHelpButton
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-11 px-5 text-white hover:bg-white/10 hover:text-white",
              )}
            >
              Get Expert Help
            </ExpertHelpButton>
          </div>
        </div>
        <div className="hero-stage relative order-1 mx-auto w-full max-w-lg lg:order-2 lg:max-w-none">
          <div className="pointer-events-none absolute inset-[10%] rounded-full bg-sky-400/25 blur-3xl" />
          <div className="hero-float relative z-10">
            <Image
              src={assetPath("/hero-laptop-3d.png")}
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

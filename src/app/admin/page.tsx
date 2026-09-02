import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default function AdminHomePage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border p-8">
        <p className="text-sm font-medium text-muted-foreground">{siteConfig.name}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Staff console</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Authentication and role-based access land in Phase 3. The admin
          dashboard, leads, inventory, and reports follow in later phases.
        </p>
        <Link
          href={routes.home}
          className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
        >
          Back to storefront
        </Link>
      </div>
    </main>
  );
}

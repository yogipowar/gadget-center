import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href={routes.home} className={cn(buttonVariants(), "mt-6")}>
        Go to homepage
      </Link>
    </main>
  );
}

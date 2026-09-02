"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">Something went wrong</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">We could not load this page</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Please try again. If the problem continues, contact GadgetCenter support.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}

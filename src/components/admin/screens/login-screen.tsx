"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { DEMO_STAFF, loginStaff, readStaffSession } from "@/features/admin/auth";

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_STAFF[0].email);
  const [password, setPassword] = useState(DEMO_STAFF[0].password);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (readStaffSession()) {
      router.replace(routes.admin.dashboard);
    }
  }, [router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const session = await loginStaff(email, password);
      if (!session) {
        toast.error("Email or password is not correct.");
        return;
      }
      toast.success(`Signed in as ${session.name}`);
      router.replace(routes.admin.dashboard);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-border bg-background p-8">
        <p className="text-sm font-medium text-muted-foreground">{siteConfig.name}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Super Admin sign in</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Only the Super Admin role is enabled for now.
        </p>
        <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
          <div className="grid gap-1.5">
            <Label htmlFor="staff-email">Email</Label>
            <Input
              id="staff-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="staff-password">Password</Label>
            <Input
              id="staff-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button type="submit" className="mt-2 h-10" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 rounded-lg bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
          Super Admin: {DEMO_STAFF[0].email} / {DEMO_STAFF[0].password}
        </p>
      </div>
    </main>
  );
}

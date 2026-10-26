"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { LogOut, Menu, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import {
  getServerStaffSession,
  isStaffSessionPending,
  logoutStaff,
  readStaffSession,
  subscribeStaffSession,
} from "@/features/admin/auth";
import { STAFF_ROLE_LABELS } from "@/features/admin/labels";
import { adminNav } from "@/features/admin/nav";
import { cn } from "@/lib/utils";

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function isActive(pathname: string, href: string) {
  const current = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === routes.admin.dashboard) {
    return current === target;
  }
  return current === target || current.startsWith(`${target}/`);
}

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-5">
      {adminNav.map((group) => (
        <div key={group.title}>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {group.title}
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                      active
                        ? "bg-sidebar-accent font-medium text-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeStaffSession,
    readStaffSession,
    getServerStaffSession,
  );
  const pending = useSyncExternalStore(
    subscribeStaffSession,
    isStaffSessionPending,
    () => true,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const current = normalizePath(pathname);
  const isLogin = current === routes.admin.login;

  useEffect(() => {
    if (isLogin || pending || session) {
      return;
    }
    router.replace(routes.admin.login);
  }, [isLogin, pending, router, session]);

  const pageTitle = useMemo(() => {
    for (const group of adminNav) {
      const match = [...group.items].reverse().find((item) => isActive(pathname, item.href));
      if (match) {
        return match.label;
      }
    }
    return "Admin";
  }, [pathname]);

  async function onLogout() {
    await logoutStaff();
    router.replace(routes.admin.login);
  }

  if (isLogin) {
    return <>{children}</>;
  }

  if (pending || !session) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-muted/30 text-sm text-muted-foreground">
        Loading staff console…
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 bg-muted/30">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="border-b border-sidebar-border px-4 py-4">
          <p className="text-sm font-semibold">{siteConfig.name}</p>
          <p className="text-xs text-muted-foreground">Staff console</p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <NavLinks pathname={pathname} />
        </div>
        <div className="border-t border-sidebar-border p-3">
          <Link
            href={routes.home}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          >
            <Store className="size-4" />
            View store
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </Button>
            <p className="text-sm font-medium">{pageTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">{session.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{STAFF_ROLE_LABELS[session.role]}</p>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut />
              Sign out
            </Button>
          </div>
        </header>
        <div className="flex-1 px-4 py-6 lg:px-8">{children}</div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle>{siteConfig.name}</SheetTitle>
          </SheetHeader>
          <div className="p-3">
            <NavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

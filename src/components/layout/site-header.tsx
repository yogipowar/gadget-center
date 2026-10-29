"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Menu, Search, ShoppingCart, User } from "lucide-react";

import { useLeadCapture } from "@/components/lead/lead-capture-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { formatPhone, telHref } from "@/lib/contact";
import { cartCount, useCart } from "@/features/cart/store";
import { categoryHref, searchSuggestions } from "@/features/catalog/queries";
import { useAdminCatalog } from "@/features/admin/catalog-store";
import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";

const navItems = [
  { href: routes.products, label: "Products" },
  { href: routes.refurbishedLaptops, label: "Refurbished" },
  { href: routes.desktops, label: "Desktop" },
  { href: routes.accessories, label: "Accessories" },
  { href: routes.printers, label: "Printers" },
  { href: routes.cctv, label: "CCTV" },
  { href: routes.services, label: "Services" },
  { href: routes.contact, label: "Contact" },
];

export function SiteHeader() {
  const router = useRouter();
  const cart = useCart();
  const { openLeadCapture } = useLeadCapture();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const catalog = useAdminCatalog();
  const count = cartCount(cart);
  const suggestions = useMemo(
    () => searchSuggestions(query, 6, catalog.products),
    [catalog.products, query],
  );
  const liveCategories = catalog.categories.filter((category) => category.live);
  const extraNav = liveCategories.filter((category) => !category.builtin);

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      return;
    }
    router.push(`${routes.search}?q=${encodeURIComponent(value)}`);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="bg-brand-navy text-white">
        <div className="mx-auto flex h-9 w-full max-w-6xl items-center justify-between px-4 text-xs">
          <p className="truncate text-white/80">
            <a className="hover:underline" href={telHref(siteConfig.contact.orderPhone)}>
              {formatPhone(siteConfig.contact.orderPhone)}
            </a>
            <span className="hidden sm:inline">
              {" "}
              · {siteConfig.contact.email} · Kolhapur
            </span>
          </p>
          <Link
            href={routes.contact}
            className="hidden shrink-0 font-medium text-white sm:inline hover:underline"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu />
        </Button>

        <Link href={routes.home} className="flex shrink-0 items-center" aria-label={siteConfig.name}>
          <Image
            src={assetPath("/logo.png")}
            alt={siteConfig.name}
            width={168}
            height={84}
            preload
            className="h-10 w-auto"
          />
        </Link>

        <form onSubmit={onSearch} className="relative hidden min-w-0 flex-1 md:flex">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search laptops, brands, SKU..."
            className="h-10 min-w-0 flex-1 rounded-r-none border-r-0 pl-8"
            aria-label="Search products"
            autoComplete="off"
            name="product-search"
          />
          <Button type="submit" className="h-10 rounded-l-none bg-brand-navy px-4 hover:bg-brand-navy/90">
            Search
          </Button>
          {suggestions.length > 0 ? (
            <ul className="absolute top-full z-50 mt-1 w-full rounded-lg border border-border bg-popover py-1 shadow-sm">
              {suggestions.map((product) => (
                <li key={product.id}>
                  <Link
                    href={routes.product(product.slug)}
                    className="block px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setQuery("")}
                  >
                    {product.brand} {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </form>

        <nav className="ml-auto flex items-center gap-1">
          <Link
            href={routes.account}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            aria-label="Account"
          >
            <User />
          </Link>
          <Link
            href={routes.cart}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
            aria-label="Cart"
          >
            <ShoppingCart />
            {count > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-green px-1 text-[10px] text-white">
                {count}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>

      <div className="hidden bg-brand-navy lg:block">
        <div className="mx-auto flex h-11 w-full max-w-6xl items-center gap-5 overflow-x-auto px-4">
          <Link href={routes.products} className="text-sm font-medium text-white hover:underline">
            Categories
          </Link>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-white/85 hover:text-white">
              {item.label}
            </Link>
          ))}
          {extraNav.map((item) => (
            <Link
              key={item.slug}
              href={categoryHref(item.slug)}
              className="text-sm whitespace-nowrap text-white/85 hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[min(100%,20rem)] p-0">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Image
                src={assetPath("/logo.png")}
                alt={siteConfig.name}
                width={168}
                height={84}
                className="h-9 w-auto"
              />
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={onSearch} className="px-4">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="h-10"
              autoComplete="off"
              name="product-search-mobile"
            />
          </form>
          <nav className="flex flex-col gap-1 overflow-y-auto p-4">
            <Link href={routes.products} className="rounded-md px-2 py-2 text-sm hover:bg-muted" onClick={() => setMenuOpen(false)}>
              All products
            </Link>
            {liveCategories.map((item) => (
              <Link
                key={item.slug}
                href={categoryHref(item.slug)}
                className="rounded-md px-2 py-2 text-sm hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link href={routes.services} className="rounded-md px-2 py-2 text-sm hover:bg-muted" onClick={() => setMenuOpen(false)}>
              Service & Repair
            </Link>
            <Link href={routes.contact} className="rounded-md px-2 py-2 text-sm hover:bg-muted" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <button
              type="button"
              className="rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
              onClick={() => {
                setMenuOpen(false);
                openLeadCapture();
              }}
            >
              Get Expert Help
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

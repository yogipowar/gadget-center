import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { additionalCategories, computerCategories } from "@/features/catalog/queries";

function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+91${digits.replace(/^91/, "")}`;
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-semibold">{siteConfig.name}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{siteConfig.description}</p>
          <p className="mt-4 text-sm text-muted-foreground">{siteConfig.contact.address}</p>
          <p className="mt-2 text-sm">
            <a className="hover:underline" href={telHref(siteConfig.contact.orderPhone)}>
              Orders: +91 {siteConfig.contact.orderPhone}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a className="hover:underline" href={telHref(siteConfig.contact.repairPhone)}>
              Repair: +91 {siteConfig.contact.repairPhone}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a className="hover:underline" href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Computers</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {computerCategories.map((category) => (
              <li key={category.slug}>
                <Link href={category.href} className="hover:text-foreground">
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Also available</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {additionalCategories.map((category) => (
              <li key={category.slug}>
                <Link href={category.href} className="hover:text-foreground">
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href={routes.about} className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href={routes.services} className="hover:text-foreground">
                Service & Repair
              </Link>
            </li>
            <li>
              <Link href={routes.contact} className="hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link href={routes.privacyPolicy} className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href={routes.terms} className="hover:text-foreground">
                Terms
              </Link>
            </li>
            <li>
              <Link href={routes.refundPolicy} className="hover:text-foreground">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href={routes.admin.root} className="hover:text-foreground">
                Staff
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

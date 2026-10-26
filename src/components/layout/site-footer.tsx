import Link from "next/link";

import { legal } from "@/config/legal";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { additionalCategories, computerCategories } from "@/features/catalog/queries";
import { formatPhone, telHref } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand-navy text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-semibold">{siteConfig.name}</p>
          <p className="mt-3 text-sm leading-6 text-white/70">{siteConfig.description}</p>
          <p className="mt-4 text-sm text-white/70">{siteConfig.contact.address}</p>
          <p className="mt-2 text-sm">
            <a className="hover:underline" href={telHref(siteConfig.contact.orderPhone)}>
              Orders: {formatPhone(siteConfig.contact.orderPhone)}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a className="hover:underline" href={telHref(siteConfig.contact.repairPhone)}>
              Repair: {formatPhone(siteConfig.contact.repairPhone)}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a className="hover:underline" href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
          </p>
          <p className="mt-2 text-xs text-white/55">
            {legal.hours}. {legal.closed}.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Computers</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {computerCategories.map((category) => (
              <li key={category.slug}>
                <Link href={category.href} className="hover:text-white">
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Also available</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {additionalCategories.map((category) => (
              <li key={category.slug}>
                <Link href={category.href} className="hover:text-white">
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <Link href={routes.about} className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href={routes.services} className="hover:text-white">
                Service & Repair
              </Link>
            </li>
            <li>
              <Link href={routes.contact} className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href={routes.privacyPolicy} className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href={routes.terms} className="hover:text-white">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href={routes.refundPolicy} className="hover:text-white">
                Refund &amp; Cancellation
              </Link>
            </li>
            <li>
              <Link href={routes.shippingPolicy} className="hover:text-white">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href={routes.admin.root} className="hover:text-white">
                Staff
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-white/55">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

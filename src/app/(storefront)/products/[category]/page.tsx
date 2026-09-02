import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductListing } from "@/components/product/product-listing";
import { shopCategories } from "@/features/catalog/queries";

const categoryMeta: Record<string, { title: string; description: string }> = {
  laptops: {
    title: "New Laptops",
    description: "New laptops from Dell, HP, Lenovo, ASUS, Acer and MSI.",
  },
  "refurbished-laptops": {
    title: "Refurbished Laptops",
    description: "Tested business laptops with condition grade and listed warranty.",
  },
  desktops: {
    title: "New Desktop PCs",
    description: "New desktops for office and home use.",
  },
  "refurbished-desktops": {
    title: "Refurbished Desktops",
    description: "Value desktop PCs with listed condition and warranty.",
  },
  "custom-pc": {
    title: "Custom PCs",
    description: "Assembled desktops built around your budget and workload.",
  },
  accessories: {
    title: "Computer Accessories",
    description: "Keyboards, mice, cables and related computer accessories.",
  },
  printers: {
    title: "Printers",
    description: "Inkjet, laser and all-in-one printers for home and office.",
  },
  ups: {
    title: "UPS",
    description: "Uninterrupted power supplies for PCs, billing counters and shops.",
  },
  monitors: {
    title: "Monitors",
    description: "Displays for laptops, desktops and CCTV viewing.",
  },
  storage: {
    title: "Storage & RAM",
    description: "SSD, HDD and memory upgrades for laptops and desktops.",
  },
  networking: {
    title: "Networking",
    description: "Routers, Wi-Fi and networking products.",
  },
  cctv: {
    title: "CCTV & Surveillance",
    description: "Cameras, DVR kits, remote monitoring and installation support.",
  },
  "home-appliances": {
    title: "Home Electronics Appliances",
    description: "LED & smart TVs and other home electronics available on enquiry.",
  },
  "pro-audio": {
    title: "Pro Audio Equipment",
    description: "Speakers, microphones and conference audio solutions.",
  },
  robotics: {
    title: "Robotics & EOT",
    description: "Educational kits, components and automation parts.",
  },
};

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return shopCategories.map((item) => ({ category: item.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category];
  if (!meta) {
    return { title: "Products" };
  }
  return { title: meta.title, description: meta.description };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const meta = categoryMeta[category];
  if (!meta) {
    notFound();
  }

  const known = shopCategories.some((item) => item.slug === category);
  if (!known) {
    notFound();
  }

  return (
    <ProductListing
      title={meta.title}
      description={meta.description}
      filters={{ categorySlug: category }}
    />
  );
}

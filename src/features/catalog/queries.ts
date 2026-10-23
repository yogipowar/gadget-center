import { REFURBISHED_GRADE_LABELS } from "@/constants/products";
import { catalogProducts } from "@/features/catalog/products";
import type { CatalogProduct, CatalogQuery } from "@/features/catalog/types";
import { routes } from "@/config/routes";

export { catalogProducts };

export const computerCategories = [
  {
    title: "New Laptops",
    href: routes.laptops,
    description: "New laptops when stock is listed",
    slug: "laptops",
  },
  {
    title: "Refurbished Laptops",
    href: routes.refurbishedLaptops,
    description: "Dell and HP business laptops, adapter included",
    slug: "refurbished-laptops",
  },
  {
    title: "New Desktops",
    href: routes.desktops,
    description: "Ready office and home PCs",
    slug: "desktops",
  },
  {
    title: "Refurbished Desktops",
    href: routes.refurbishedDesktops,
    description: "Value desktops for business use",
    slug: "refurbished-desktops",
  },
  {
    title: "Custom PCs",
    href: routes.customPc,
    description: "Built to your budget and work",
    slug: "custom-pc",
  },
  {
    title: "Accessories",
    href: routes.accessories,
    description: "Keyboards, mice, cables and more",
    slug: "accessories",
  },
] as const;

export const additionalCategories = [
  {
    title: "Printers",
    href: routes.printers,
    description: "Inkjet, laser and all-in-one",
    slug: "printers",
  },
  {
    title: "UPS",
    href: routes.ups,
    description: "Backup power for PCs and shops",
    slug: "ups",
  },
  {
    title: "Monitors",
    href: routes.monitors,
    description: "Displays for laptops and desktops",
    slug: "monitors",
  },
  {
    title: "Storage & RAM",
    href: routes.storage,
    description: "SSD, HDD and memory upgrades",
    slug: "storage",
  },
  {
    title: "Networking",
    href: routes.networking,
    description: "Routers, switches and Wi-Fi",
    slug: "networking",
  },
  {
    title: "CCTV & Surveillance",
    href: routes.cctv,
    description: "Cameras, DVR kits and installation",
    slug: "cctv",
  },
  {
    title: "Home Appliances",
    href: routes.homeAppliances,
    description: "TVs, ACs, refrigerators and more",
    slug: "home-appliances",
  },
  {
    title: "Pro Audio",
    href: routes.proAudio,
    description: "Speakers, mics and conference audio",
    slug: "pro-audio",
  },
  {
    title: "Robotics & EOT",
    href: routes.robotics,
    description: "Kits, components and automation",
    slug: "robotics",
  },
] as const;

export const shopCategories = [...computerCategories, ...additionalCategories];

export const laptopBrands = ["Dell", "HP"] as const;

export const budgetBands = [
  { label: "Under ₹20,000", minPrice: 0, maxPrice: 19999 },
  { label: "₹20,000–₹30,000", minPrice: 20000, maxPrice: 30000 },
  { label: "₹30,000–₹50,000", minPrice: 30000, maxPrice: 50000 },
  { label: "₹50,000–₹75,000", minPrice: 50000, maxPrice: 75000 },
  { label: "Above ₹75,000", minPrice: 75001, maxPrice: undefined },
] as const;

export function conditionLabel(product: CatalogProduct) {
  if (product.condition === "REFURBISHED") {
    const grade = product.grade ? REFURBISHED_GRADE_LABELS[product.grade] : null;
    return grade ? `Refurbished | Grade ${grade}` : "Refurbished";
  }
  if (product.condition === "USED") {
    return "Used";
  }
  return "New";
}

export function productFacts(product: CatalogProduct) {
  const ramLine = product.specs.find((item) => /RAM/i.test(item));
  const storageLine = product.specs.find((item) => /(SSD|HDD|NVMe)/i.test(item) && !/RAM/i.test(item));
  const screenLine = product.specs.find((item) => /inch/i.test(item));
  const processor =
    product.specs.find((item) => /core|ultra|ryzen|intel|amd/i.test(item) && !/RAM|SSD|inch/i.test(item)) ?? "";
  const ram = ramLine?.replace(/\s*RAM/i, "").trim() ?? "";
  const storageCapacity = storageLine?.match(/(\d+\s*GB)/i)?.[1]?.replace(/\s+/g, "") ?? "";
  const storageType = storageLine
    ? /M\.?2/i.test(storageLine)
      ? "SSD (M.2 NVMe)"
      : /SSD/i.test(storageLine)
        ? "SSD"
        : /HDD/i.test(storageLine)
          ? "HDD"
          : ""
    : "";
  const screenSize = screenLine?.replace(/touchscreen/i, "").replace(/\s+/g, " ").trim() ?? "";
  const model = product.name
    .replace(new RegExp(`^${product.brand}\\s+`, "i"), "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();

  return {
    sku: product.sku,
    brand: product.brand,
    model,
    processor,
    ram,
    storageCapacity: storageCapacity || storageLine || "",
    storageType,
    screenSize,
    touchScreen: product.specs.some((item) => /touch/i.test(item)),
    adapterIncluded: product.specs.some((item) => /adapter/i.test(item)),
    condition: conditionLabel(product),
    warranty: product.warranty.trim(),
  };
}

export function queryCatalog(
  filters: CatalogQuery = {},
  products: CatalogProduct[] = catalogProducts,
): CatalogProduct[] {
  return products.filter((product) => {
    if (filters.categorySlug && product.categorySlug !== filters.categorySlug) {
      return false;
    }
    const brandFilters = filters.brands?.length
      ? filters.brands
      : filters.brand
        ? [filters.brand]
        : [];
    if (brandFilters.length > 0) {
      const selected = brandFilters.map((item) => item.toLowerCase());
      const known = ["dell", "hp"];
      const matches = selected.some((item) => {
        if (item === "other") {
          return !known.includes(product.brand.toLowerCase());
        }
        return product.brand.toLowerCase() === item;
      });
      if (!matches) {
        return false;
      }
    }
    const conditionFilters = filters.conditions?.length
      ? filters.conditions
      : filters.condition
        ? [filters.condition]
        : [];
    if (conditionFilters.length > 0 && !conditionFilters.includes(product.condition)) {
      return false;
    }
    if (filters.productType && product.productType !== filters.productType) {
      return false;
    }
    if (filters.refurbished && product.condition !== "REFURBISHED") {
      return false;
    }
    if (filters.minPrice !== undefined && product.salePrice < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.salePrice > filters.maxPrice) {
      return false;
    }
    if (filters.featured && !product.featured) {
      return false;
    }
    if (filters.bestseller && !product.bestseller) {
      return false;
    }
    if (filters.newArrival && !product.newArrival) {
      return false;
    }
    if (filters.q) {
      const haystack = [
        product.name,
        product.sku,
        product.brand,
        product.specs.join(" "),
        product.categorySlug,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(filters.q.toLowerCase().trim())) {
        return false;
      }
    }
    return true;
  });
}

export function pickDiverseCatalog(products: CatalogProduct[], limit: number) {
  const picked: CatalogProduct[] = [];
  const usedIds = new Set<string>();
  const usedTypes = new Set<string>();

  for (const product of products) {
    if (picked.length >= limit) {
      break;
    }
    if (usedTypes.has(product.productType)) {
      continue;
    }
    picked.push(product);
    usedIds.add(product.id);
    usedTypes.add(product.productType);
  }

  for (const product of products) {
    if (picked.length >= limit) {
      break;
    }
    if (usedIds.has(product.id)) {
      continue;
    }
    picked.push(product);
    usedIds.add(product.id);
  }

  return picked;
}

const TYPE_GALLERY: Partial<Record<CatalogProduct["productType"], string[]>> = {
  LAPTOP: [
    "/products/gallery/laptop-2.png",
    "/products/gallery/laptop-3.png",
    "/products/gallery/laptop-4.png",
  ],
  DESKTOP: ["/products/gallery/desktop-2.png", "/products/gallery/desktop-3.png"],
  CUSTOM_PC: ["/products/gallery/custom-pc-2.png", "/products/gallery/custom-pc-3.png"],
  PRINTER: ["/products/gallery/printer-2.png", "/products/gallery/printer-3.png"],
  MONITOR: ["/products/gallery/monitor-2.png", "/products/gallery/monitor-3.png"],
  UPS: ["/products/gallery/ups-2.png", "/products/gallery/ups-3.png"],
  NETWORKING: ["/products/gallery/router-2.png", "/products/gallery/router-3.png"],
  CCTV: ["/products/gallery/cctv-2.png", "/products/gallery/cctv-3.png"],
  APPLIANCE: ["/products/gallery/tv-2.png", "/products/gallery/tv-3.png"],
  ROBOTICS: ["/products/gallery/robot-2.png", "/products/gallery/robot-3.png"],
};

function extrasFor(product: CatalogProduct) {
  if (product.productType === "AUDIO") {
    return product.slug.includes("mic")
      ? ["/products/gallery/mic-2.png"]
      : ["/products/gallery/audio-2.png"];
  }
  if (product.productType === "ACCESSORY") {
    if (product.slug.includes("keys") || product.slug.includes("keyboard")) {
      return ["/products/gallery/keyboard-2.png", "/products/gallery/keyboard-3.png"];
    }
    if (product.slug.includes("mouse")) {
      return ["/products/gallery/mouse-2.png"];
    }
    if (product.slug.includes("hdmi") || product.slug.includes("cable")) {
      return ["/products/gallery/cable-2.png"];
    }
    if (product.slug.includes("ram")) {
      return ["/products/gallery/ram-2.png"];
    }
    if (product.slug.includes("ssd")) {
      return ["/products/gallery/ssd-2.png"];
    }
  }
  return TYPE_GALLERY[product.productType] ?? [];
}

export function productGallery(product: CatalogProduct) {
  const unique = new Set<string>();
  if (product.image) {
    unique.add(product.image);
  }
  for (const src of product.images ?? []) {
    unique.add(src);
  }
  if (!product.images?.length) {
    for (const src of extrasFor(product)) {
      unique.add(src);
    }
  }
  return [...unique];
}

export function getProductBySlug(slug: string, products: CatalogProduct[] = catalogProducts) {
  return products.find((product) => product.slug === slug) ?? null;
}

export function relatedProducts(
  product: CatalogProduct,
  products: CatalogProduct[] = catalogProducts,
  limit = 4,
) {
  return products
    .filter((item) => item.id !== product.id && item.slug !== product.slug)
    .map((item) => {
      let score = 0;
      if (item.categorySlug === product.categorySlug) {
        score += 8;
      }
      if (item.productType === product.productType) {
        score += 5;
      }
      if (item.brand.toLowerCase() === product.brand.toLowerCase()) {
        score += 3;
      }
      if (item.condition === product.condition) {
        score += 2;
      }
      const gap = Math.abs(item.salePrice - product.salePrice) / Math.max(product.salePrice, 1);
      if (gap <= 0.35) {
        score += 1;
      }
      if (item.featured || item.bestseller) {
        score += 1;
      }
      return { item, score };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((row) => row.item);
}

export function searchSuggestions(q: string, limit = 6, products: CatalogProduct[] = catalogProducts) {
  const query = q.trim().toLowerCase();
  if (query.length < 2) {
    return [];
  }
  return products
    .filter((product) =>
      [product.name, product.brand, product.sku].join(" ").toLowerCase().includes(query),
    )
    .slice(0, limit);
}

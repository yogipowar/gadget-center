import { REFURBISHED_GRADE_LABELS } from "@/constants/products";
import { catalogProducts } from "@/features/catalog/products";
import type { CatalogProduct, CatalogQuery } from "@/features/catalog/types";
import { routes } from "@/config/routes";

export { catalogProducts };

export const computerCategories = [
  {
    title: "New Laptops",
    href: routes.laptops,
    description: "Dell, HP, Lenovo, ASUS and more",
    slug: "laptops",
  },
  {
    title: "Refurbished Laptops",
    href: routes.refurbishedLaptops,
    description: "Tested devices, graded condition",
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

export const laptopBrands = ["Dell", "HP", "Lenovo", "ASUS", "Acer", "Apple", "MSI", "Other"] as const;

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

export function queryCatalog(filters: CatalogQuery = {}): CatalogProduct[] {
  return catalogProducts.filter((product) => {
    if (filters.categorySlug && product.categorySlug !== filters.categorySlug) {
      return false;
    }
    if (filters.brand && filters.brand !== "Other") {
      if (product.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }
    }
    if (filters.brand === "Other") {
      const known = ["Dell", "HP", "Lenovo", "ASUS", "Acer", "Apple", "MSI"];
      if (known.includes(product.brand)) {
        return false;
      }
    }
    if (filters.condition && product.condition !== filters.condition) {
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

export function getProductBySlug(slug: string) {
  return catalogProducts.find((product) => product.slug === slug) ?? null;
}

export function searchSuggestions(q: string, limit = 6) {
  const query = q.trim().toLowerCase();
  if (query.length < 2) {
    return [];
  }
  return catalogProducts
    .filter((product) =>
      [product.name, product.brand, product.sku].join(" ").toLowerCase().includes(query),
    )
    .slice(0, limit);
}

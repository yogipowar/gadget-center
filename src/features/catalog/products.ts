import type { CatalogProduct } from "@/features/catalog/types";

const SHORT =
  "Refurbished business laptop. 100% import stock. Adapter included.";
const GALLERY = [
  "/products/gallery/laptop-2.png",
  "/products/gallery/laptop-3.png",
  "/products/gallery/laptop-4.png",
];

function listedPrice(amount: number) {
  return Math.round((amount * 115) / 100);
}

function originalPrice(salePrice: number, seed: string) {
  const hash = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const percent = 20 + (hash % 6);
  return Math.round((salePrice * (100 + percent)) / 100);
}

type StockLaptop = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: "Dell" | "HP";
  processor: string;
  ram?: string;
  storage?: string;
  screen: string;
  extras?: string[];
  listed: number;
  onHand: number;
  featured?: boolean;
  bestseller?: boolean;
  image: string;
};

function laptop(item: StockLaptop): CatalogProduct {
  const salePrice = listedPrice(item.listed);
  const price = originalPrice(salePrice, item.id);
  const ram = item.ram ?? "8GB";
  const storage = item.storage ?? "256GB M.2 NVMe SSD";
  return {
    id: item.id,
    sku: item.sku,
    slug: item.slug,
    name: item.name,
    brand: item.brand,
    categorySlug: "refurbished-laptops",
    productType: "LAPTOP",
    condition: "REFURBISHED",
    price,
    salePrice,
    warranty: "",
    specs: [
      item.processor,
      `${ram} RAM`,
      storage,
      item.screen,
      "Refurbished",
      "Adapter included",
      ...(item.extras ?? []),
    ],
    shortDescription: SHORT,
    featured: Boolean(item.featured),
    bestseller: Boolean(item.bestseller),
    newArrival: true,
    inStock: item.onHand > 0,
    onHand: item.onHand,
    accent: item.brand === "HP" ? "slate" : "navy",
    image: item.image,
    images: [item.image, ...GALLERY],
  };
}

export const catalogProducts: CatalogProduct[] = [
  laptop({
    id: "p-lat-3310-i5-8",
    slug: "dell-latitude-3310-touch-i5-8th",
    sku: "GC-LAT-3310-I5-8",
    name: "Dell Latitude 3310 Touch (13.3\")",
    brand: "Dell",
    processor: "Intel Core i5, 8th Gen",
    screen: "13.3-inch touchscreen",
    extras: ["Touchscreen"],
    image: "/products/dell-latitude-3310.jpg",
    listed: 22550,
    onHand: 3,
  }),
  laptop({
    id: "p-lat-5400-i5-8",
    slug: "dell-latitude-5400-i5-8th",
    sku: "GC-LAT-5400-I5-8",
    name: "Dell Latitude 5400 (i5 8th Gen)",
    brand: "Dell",
    processor: "Intel Core i5, 8th Gen",
    screen: "14-inch",
    image: "/products/dell-latitude-5400.jpg",
    listed: 23100,
    onHand: 22,
    bestseller: true,
  }),
  laptop({
    id: "p-lat-5410-i5-10",
    slug: "dell-latitude-5410-i5-10th",
    sku: "GC-LAT-5410-I5-10",
    name: "Dell Latitude 5410 (i5 10th Gen)",
    brand: "Dell",
    processor: "Intel Core i5, 10th Gen",
    screen: "14-inch",
    image: "/products/dell-latitude-5410-refurbished.png",
    listed: 25300,
    onHand: 3,
    featured: true,
  }),
  laptop({
    id: "p-lat-5420-i5-11",
    slug: "dell-latitude-5420-i5-11th",
    sku: "GC-LAT-5420-I5-11",
    name: "Dell Latitude 5420 (i5 11th Gen)",
    brand: "Dell",
    processor: "Intel Core i5, 11th Gen",
    screen: "14-inch",
    image: "/products/dell-latitude-5420.jpg",
    listed: 27500,
    onHand: 3,
  }),
  laptop({
    id: "p-lat-5320-i5-11",
    slug: "dell-latitude-5320-i5-11th",
    sku: "GC-LAT-5320-I5-11",
    name: "Dell Latitude 5320 (i5 11th Gen)",
    brand: "Dell",
    processor: "Intel Core i5, 11th Gen",
    ram: "16GB",
    screen: "14-inch",
    image: "/products/dell-latitude-5320.jpg",
    listed: 30250,
    onHand: 25,
    featured: true,
    bestseller: true,
  }),
  laptop({
    id: "p-hp-630-g8",
    slug: "hp-elitebook-630-g8-touch-i5-11th",
    sku: "GC-HP-630G8-I5-11",
    name: "HP EliteBook 630 G8 Touch",
    brand: "HP",
    processor: "Intel Core i5, 11th Gen",
    screen: "14-inch touchscreen",
    extras: ["Brand-new touchscreen"],
    image: "/products/hp-elitebook-630-g8.jpg",
    listed: 30800,
    onHand: 40,
    featured: true,
    bestseller: true,
  }),
  laptop({
    id: "p-hp-zbook-14-g8",
    slug: "hp-zbook-14-g8-i5-11th",
    sku: "GC-HP-Z14G8-I5-11",
    name: "HP ZBook 14 G8",
    brand: "HP",
    processor: "Intel Core i5, 11th Gen",
    screen: "14-inch",
    image: "/products/hp-zbook-14-g8.jpg",
    listed: 32780,
    onHand: 17,
    featured: true,
  }),
  laptop({
    id: "p-lat-5400-i7-8",
    slug: "dell-latitude-5400-i7-8th",
    sku: "GC-LAT-5400-I7-8",
    name: "Dell Latitude 5400 (i7 8th Gen)",
    brand: "Dell",
    processor: "Intel Core i7, 8th Gen",
    screen: "14-inch",
    image: "/products/dell-latitude-5400.jpg",
    listed: 26400,
    onHand: 15,
  }),
  laptop({
    id: "p-lat-5420-i7-11",
    slug: "dell-latitude-5420-i7-11th",
    sku: "GC-LAT-5420-I7-11",
    name: "Dell Latitude 5420 (i7 11th Gen)",
    brand: "Dell",
    processor: "Intel Core i7, 11th Gen",
    screen: "14-inch",
    image: "/products/dell-latitude-5420.jpg",
    listed: 32999,
    onHand: 40,
    featured: true,
    bestseller: true,
  }),
  laptop({
    id: "p-lat-7420-i7-11",
    slug: "dell-latitude-7420-i7-11th",
    sku: "GC-LAT-7420-I7-11",
    name: "Dell Latitude 7420 (i7 11th Gen)",
    brand: "Dell",
    processor: "Intel Core i7, 11th Gen",
    ram: "16GB",
    screen: "14-inch",
    image: "/products/dell-latitude-7420.jpg",
    listed: 36300,
    onHand: 25,
    featured: true,
  }),
  laptop({
    id: "p-lat-5590-i5-8",
    slug: "dell-latitude-5590-i5-8th",
    sku: "GC-LAT-5590-I5-8",
    name: "Dell Latitude 5590 (i5 8th Gen)",
    brand: "Dell",
    processor: "Intel Core i5, 8th Gen",
    screen: "15.6-inch",
    image: "/products/dell-latitude-5590.jpg",
    listed: 25850,
    onHand: 22,
    bestseller: true,
  }),
  laptop({
    id: "p-lat-5500-i5-8",
    slug: "dell-latitude-5500-i5-8th",
    sku: "GC-LAT-5500-I5-8",
    name: "Dell Latitude 5500 (i5 8th Gen)",
    brand: "Dell",
    processor: "Intel Core i5, 8th Gen",
    screen: "15.6-inch",
    image: "/products/dell-latitude-5500.jpg",
    listed: 25850,
    onHand: 20,
  }),
  laptop({
    id: "p-lat-5510-i5-10",
    slug: "dell-latitude-5510-i5-10th",
    sku: "GC-LAT-5510-I5-10",
    name: "Dell Latitude 5510 (i5 10th Gen)",
    brand: "Dell",
    processor: "Intel Core i5, 10th Gen",
    screen: "15.6-inch",
    image: "/products/dell-latitude-5510.jpg",
    listed: 30250,
    onHand: 80,
    featured: true,
    bestseller: true,
  }),
  laptop({
    id: "p-lat-5530-i5-12",
    slug: "dell-latitude-5530-i5-12th",
    sku: "GC-LAT-5530-I5-12",
    name: "Dell Latitude 5530 (i5 12th Gen)",
    brand: "Dell",
    processor: "Intel Core i5, 12th Gen",
    screen: "15.6-inch",
    image: "/products/dell-latitude-5530.jpg",
    listed: 38500,
    onHand: 10,
  }),
  laptop({
    id: "p-lat-5540-i5-13",
    slug: "dell-latitude-5540-i5-13th",
    sku: "GC-LAT-5540-I5-13",
    name: "Dell Latitude 5540 (i5 13th Gen)",
    brand: "Dell",
    processor: "Intel Core i5, 13th Gen",
    screen: "15.6-inch",
    image: "/products/dell-latitude-5540.jpg",
    listed: 42900,
    onHand: 7,
    featured: true,
  }),
  laptop({
    id: "p-lat-5580-i7-7",
    slug: "dell-latitude-5580-i7-7th",
    sku: "GC-LAT-5580-I7-7",
    name: "Dell Latitude 5580 (i7 7th Gen H)",
    brand: "Dell",
    processor: "Intel Core i7, 7th Gen H-Series",
    screen: "15.6-inch",
    image: "/products/dell-latitude-5580.jpg",
    listed: 25850,
    onHand: 3,
  }),
  laptop({
    id: "p-lat-5510-i7-10",
    slug: "dell-latitude-5510-i7-10th",
    sku: "GC-LAT-5510-I7-10",
    name: "Dell Latitude 5510 (i7 10th Gen)",
    brand: "Dell",
    processor: "Intel Core i7, 10th Gen",
    screen: "15.6-inch",
    image: "/products/dell-latitude-5510.jpg",
    listed: 32999,
    onHand: 22,
    bestseller: true,
  }),
  laptop({
    id: "p-lat-5520-i7-11",
    slug: "dell-latitude-5520-i7-11th",
    sku: "GC-LAT-5520-I7-11",
    name: "Dell Latitude 5520 (i7 11th Gen)",
    brand: "Dell",
    processor: "Intel Core i7, 11th Gen",
    screen: "15.6-inch",
    image: "/products/dell-latitude-5520.jpg",
    listed: 39050,
    onHand: 20,
  }),
  laptop({
    id: "p-lat-5450-u5",
    slug: "dell-latitude-5450-ultra-5",
    sku: "GC-LAT-5450-U5",
    name: "Dell Latitude 5450 (Core Ultra 5)",
    brand: "Dell",
    processor: "Intel Core Ultra 5",
    ram: "16GB",
    storage: "512GB SSD",
    screen: "14-inch",
    image: "/products/dell-latitude-5450.jpg",
    listed: 64350,
    onHand: 15,
    featured: true,
  }),
];

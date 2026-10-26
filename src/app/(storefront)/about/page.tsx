import { BusinessContact } from "@/components/legal/business-contact";
import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";
import { legal } from "@/config/legal";
import { routes } from "@/config/routes";
import Link from "next/link";

export const metadata = simpleMetadata(
  "About GadgetCenter",
  "GadgetCenter sells laptops, computers and electronics from Kolhapur, with pan-India shipping.",
);

export default function AboutPage() {
  return (
    <SimplePage
      title="About GadgetCenter"
      description="GadgetCenter is a Kolhapur-based computer and electronics shop. We sell listed products online with published prices and ship across India."
    >
      <h2>What we sell</h2>
      <p>
        Core range: new and refurbished laptops, desktops, custom PC builds, monitors, storage, RAM, printers,
        UPS, keyboards, mice, cables and networking products. Every product page shows the model, condition,
        specifications and selling price in INR.
      </p>
      <p>
        Also available: CCTV cameras and installation, home electronics, pro audio, robotics and EOT kits, plus
        service, repair and annual maintenance. Service charges are listed on the{" "}
        <Link href={routes.services} className="font-medium text-foreground underline">
          Services
        </Link>{" "}
        page.
      </p>
      <h2>How we sell</h2>
      <p>
        Browse the catalogue, add items to cart, and pay online. Cash on delivery is not available. Refurbished
        computers show a condition grade when we have it. Warranty is only the cover written on that product.
        We ship from {legal.shipsFrom}.
      </p>
      <BusinessContact heading="Visit or call" />
    </SimplePage>
  );
}

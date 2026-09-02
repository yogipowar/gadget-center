import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";
import { siteConfig } from "@/config/site";

export const metadata = simpleMetadata(
  "Services",
  "Laptop sales, CCTV installation, electronics repair and annual maintenance.",
);

export default function ServicesPage() {
  return (
    <SimplePage
      title="Service & Repair"
      description="Sales plus installation, configuration and repair for computers and electronics."
    >
      <p className="font-medium text-foreground">Computers</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>New and refurbished laptop and desktop sales</li>
        <li>Custom PC builds</li>
        <li>Laptop servicing and hardware upgrades (RAM, SSD)</li>
        <li>Printer, UPS and accessory supply</li>
      </ul>
      <p className="font-medium text-foreground">CCTV & installation</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>High-resolution CCTV cameras and DVR kits</li>
        <li>Professional installation for homes and offices</li>
        <li>Remote monitoring setup</li>
        <li>Maintenance and support</li>
      </ul>
      <p className="font-medium text-foreground">Repair & AMC</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Laptop and mobile servicing</li>
        <li>Repairs for electronics and appliances</li>
        <li>Installation and configuration support</li>
        <li>Annual maintenance contracts</li>
        <li>On-site and in-shop service</li>
      </ul>
      <p>
        Repair desk: +91 {siteConfig.contact.repairPhone}. Orders: +91 {siteConfig.contact.orderPhone}.
      </p>
    </SimplePage>
  );
}

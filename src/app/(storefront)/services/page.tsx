import { BusinessContact } from "@/components/legal/business-contact";
import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";
import { formatInr } from "@/utils/currency";

export const metadata = simpleMetadata(
  "Services & Pricing",
  "Laptop sales support, CCTV installation, electronics repair and AMC — with starting prices.",
);

const serviceRates = [
  { name: "Laptop / desktop diagnosis", price: 299, note: "Adjusted against repair if you proceed" },
  { name: "Laptop servicing (cleaning + basic checks)", price: 499, note: "Parts extra if needed" },
  { name: "RAM upgrade labour", price: 299, note: "RAM module priced separately" },
  { name: "SSD upgrade labour", price: 399, note: "SSD priced separately; data clone quoted if required" },
  { name: "Custom PC assembly", price: 1499, note: "Components billed at listed or quoted prices" },
  { name: "CCTV installation (up to 4 cameras)", price: 2499, note: "Cameras, DVR, cable and extra points extra" },
  { name: "Additional CCTV camera install", price: 499, note: "Per extra camera after the first four" },
  { name: "Printer / UPS setup at shop", price: 199, note: "On-site visit quoted after pin code" },
  { name: "Annual maintenance (AMC)", price: 2999, note: "Starting price for one PC; quote after inspection" },
];

export default function ServicesPage() {
  return (
    <SimplePage
      title="Services & Pricing"
      description="Sales support, installation, configuration and repair for computers and electronics. Product prices are on each product page. The charges below are labour / service starting prices in INR."
    >
      <h2>Service charges</h2>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-zinc-50 text-foreground">
            <tr>
              <th className="px-3 py-2 font-semibold">Service</th>
              <th className="px-3 py-2 font-semibold">Starting price</th>
              <th className="hidden px-3 py-2 font-semibold sm:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody>
            {serviceRates.map((row) => (
              <tr key={row.name} className="border-b border-border last:border-0">
                <td className="px-3 py-2 text-foreground">
                  {row.name}
                  <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">{row.note}</p>
                </td>
                <td className="px-3 py-2 font-medium text-foreground">
                  {formatInr(row.price, { compact: true })}
                </td>
                <td className="hidden px-3 py-2 sm:table-cell">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Final on-site charges can change with distance, wall chasing, extra cable or replacement parts. We confirm
        the amount before work starts. Service bookings are prepaid or paid at the shop as agreed when we confirm
        the appointment.
      </p>
      <h2>Computers</h2>
      <ul>
        <li>New and refurbished laptop and desktop sales (prices on the product pages)</li>
        <li>Custom PC builds</li>
        <li>Laptop servicing and hardware upgrades (RAM, SSD)</li>
        <li>Printer, UPS and accessory supply</li>
      </ul>
      <h2>CCTV &amp; installation</h2>
      <ul>
        <li>High-resolution CCTV cameras and DVR kits</li>
        <li>Professional installation for homes and offices</li>
        <li>Remote monitoring setup</li>
        <li>Maintenance and support</li>
      </ul>
      <h2>Repair &amp; AMC</h2>
      <ul>
        <li>Laptop and mobile servicing</li>
        <li>Repairs for electronics and appliances</li>
        <li>Installation and configuration support</li>
        <li>Annual maintenance contracts</li>
        <li>On-site and in-shop service</li>
      </ul>
      <BusinessContact heading="Book a service" />
    </SimplePage>
  );
}

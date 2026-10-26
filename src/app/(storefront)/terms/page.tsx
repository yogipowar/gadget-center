import { BusinessContact } from "@/components/legal/business-contact";
import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";
import { legal } from "@/config/legal";
import { routes } from "@/config/routes";
import Link from "next/link";

export const metadata = simpleMetadata(
  "Terms & Conditions",
  "Terms of sale and website use for GadgetCenter.",
);

export default function TermsPage() {
  return (
    <SimplePage
      title="Terms & Conditions"
      description={`Last updated: ${legal.lastUpdated}. By browsing gadgetcenter.in, sending an enquiry, or paying for an order, you agree to these terms.`}
    >
      <h2>Products and prices</h2>
      <p>
        GadgetCenter sells new and refurbished laptops, desktops, accessories, printers, UPS, monitors, storage,
        networking, CCTV, home electronics, pro audio and robotics products, plus installation, repair and AMC
        services. Each product page shows the name, description, condition, key specifications and selling price
        in Indian Rupees. The price charged is the selling price displayed at checkout. Prices include applicable
        GST unless a page says otherwise.
      </p>
      <p>
        Refurbished and used items are not new. Grade, cosmetic notes and warranty (if any) are as shown on that
        listing. Photographs are of typical stock; small marks can differ between units.
      </p>
      <h2>Orders and payment</h2>
      <p>
        Orders are accepted only after successful online payment (UPI, debit/credit card or netbanking) through
        Razorpay. Cash on delivery is not offered. An order is confirmed when payment is captured. We may cancel
        an order if stock is unavailable, the address cannot be served, or payment is reversed; in that case the
        paid amount is refunded as described in the{" "}
        <Link href={routes.refundPolicy} className="font-medium text-foreground underline">
          Refund &amp; Cancellation Policy
        </Link>
        .
      </p>
      <h2>Shipping and services</h2>
      <p>
        Physical goods ship from {legal.shipsFrom} to addresses in {legal.deliveryArea}. Delivery timelines and
        charges are in the{" "}
        <Link href={routes.shippingPolicy} className="font-medium text-foreground underline">
          Shipping Policy
        </Link>
        . Installation, repair and AMC are scheduled separately after we confirm the job.
      </p>
      <h2>Use of the website</h2>
      <p>
        You must provide accurate contact and address details. You must not misuse the site, attempt unauthorised
        access, or place orders with stolen payment instruments. Listing errors can be corrected; we will contact
        you before charging a higher price.
      </p>
      <h2>Liability</h2>
      <p>
        Our liability for a product is limited to repair, replacement or refund as set out in the refund policy
        and any warranty stated on the listing. We are not liable for indirect or consequential loss, or for delays
        caused by courier, weather or events outside our control.
      </p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. Courts in Kolhapur, Maharashtra have jurisdiction.</p>
      <BusinessContact heading="Questions about these terms" />
    </SimplePage>
  );
}

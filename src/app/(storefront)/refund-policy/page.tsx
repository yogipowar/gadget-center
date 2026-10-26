import { BusinessContact } from "@/components/legal/business-contact";
import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";
import { legal } from "@/config/legal";
import { siteConfig } from "@/config/site";

export const metadata = simpleMetadata(
  "Refund & Cancellation Policy",
  "How GadgetCenter handles cancellations, returns and refunds.",
);

export default function RefundPage() {
  return (
    <SimplePage
      title="Refund & Cancellation Policy"
      description={`Last updated: ${legal.lastUpdated}. This policy applies to prepaid orders placed on gadgetcenter.in.`}
    >
      <h2>Cancellation by you</h2>
      <ul>
        <li>
          Before dispatch: email {siteConfig.contact.email} or call {siteConfig.contact.orderPhone} with your
          order number. If the parcel has not been handed to the courier, we cancel the order and refund the full
          amount paid.
        </li>
        <li>
          After dispatch: you may refuse delivery. Once the parcel returns to us in sellable condition, we refund
          the product amount. Outward courier cost may be deducted if the cancellation is not due to our error.
        </li>
      </ul>
      <h2>Cancellation by us</h2>
      <p>
        We may cancel if an item is out of stock, cannot be delivered to your pincode, or payment is not captured.
        Any amount we received is refunded in full.
      </p>
      <h2>Returns and replacements</h2>
      <ul>
        <li>
          Dead on arrival or wrong item: tell us within 48 hours of delivery with unboxing photos or video. We
          arrange replacement or refund after inspection.
        </li>
        <li>
          New products: unused items in original packing may be returned within 7 days of delivery if the listing
          did not match what arrived.
        </li>
        <li>
          Refurbished or used products: sold as described on the product page. Cosmetic wear consistent with the
          listed condition is not a defect. Returns are accepted for functional failure reported within 7 days,
          not for change of mind after the unit has been used.
        </li>
        <li>
          Installation, repair, diagnosis and AMC fees are not refundable once the engineer has visited or the
          work has started, unless we fail to deliver the booked service.
        </li>
      </ul>
      <h2>How refunds are paid</h2>
      <p>
        Approved refunds are issued to the original Razorpay payment method (the same UPI, card or netbanking
        account). Bank or UPI credit usually appears in 5–7 working days after we approve the refund. We do not
        offer cash refunds.
      </p>
      <h2>Warranty after delivery</h2>
      <p>
        If a product page lists a warranty, that cover starts from the delivery date and is handled as written on
        the listing. If no warranty is listed, ask us before you pay.
      </p>
      <BusinessContact heading="Raise a cancellation or refund" />
    </SimplePage>
  );
}

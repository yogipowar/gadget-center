import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";

export const metadata = simpleMetadata(
  "Refund Policy",
  "Returns and refunds for GadgetCenter orders.",
);

export default function RefundPage() {
  return (
    <SimplePage
      title="Refund Policy"
      description="Return eligibility depends on the product type and the condition stated on the order."
    >
      <p>
        New products follow the return window confirmed at checkout or on the invoice. Refurbished
        returns are assessed against the listed grade and testing notes. Exact timelines will be
        published in store settings.
      </p>
    </SimplePage>
  );
}

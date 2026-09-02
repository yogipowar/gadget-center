import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";

export const metadata = simpleMetadata("Terms", "Terms of use for the GadgetCenter website.");

export default function TermsPage() {
  return (
    <SimplePage title="Terms" description="Using this website to browse, enquire or order is subject to these terms.">
      <p>
        Product prices, stock and warranty are as shown on each listing at the time you enquire or
        order. Refurbished grades describe cosmetic and tested condition, not a new-device promise.
      </p>
    </SimplePage>
  );
}

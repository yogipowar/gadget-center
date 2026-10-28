import { BusinessContact } from "@/components/legal/business-contact";
import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";
import { legal } from "@/config/legal";
import { siteConfig } from "@/config/site";

export const metadata = simpleMetadata(
  "Privacy Policy",
  "How GadgetCenter collects, uses and stores customer information.",
);

export default function PrivacyPage() {
  return (
    <SimplePage
      title="Privacy Policy"
      description={`Last updated: ${legal.lastUpdated}. This policy explains what personal information GadgetCenter collects when you browse, enquire or pay on gadgetcenter.in.`}
    >
      <h2>Who we are</h2>
      <p>
        {legal.businessName} sells computers, electronics and related services from {siteConfig.contact.address}.
        For privacy questions write to {siteConfig.contact.email} or call {siteConfig.contact.orderPhone}.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Name, mobile number, email, delivery address, city, state and pincode when you enquire or place an order.</li>
        <li>Order items, amount and payment status. UPI PIN and bank login are never entered on this website.</li>
        <li>WhatsApp or phone messages you send us about a product or repair.</li>
        <li>Basic device and browser information, and advertising click parameters if you arrive from an ad.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To confirm orders, arrange shipping, installation or repair, and provide after-sales support.</li>
        <li>To send order updates on call, SMS, WhatsApp or email.</li>
        <li>To improve the catalogue and prevent fraud or abuse.</li>
      </ul>
      <h2>Sharing</h2>
      <p>
        We share only what is required with courier partners and our hosting provider. We do not sell personal
        data. We may disclose information if Indian law requires it.
      </p>
      <h2>Retention and security</h2>
      <p>
        Order and enquiry records are kept as long as needed for accounts, warranty and tax. Access is limited
        to authorised staff. No website can guarantee absolute security; we take reasonable care of the data we hold.
      </p>
      <h2>Your choices</h2>
      <p>
        You may ask us to correct or delete enquiry data that is not required for an active order, warranty or
        legal record. Contact us using the details below.
      </p>
      <BusinessContact heading="Contact for privacy requests" />
    </SimplePage>
  );
}

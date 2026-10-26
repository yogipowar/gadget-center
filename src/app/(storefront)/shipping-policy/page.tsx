import { BusinessContact } from "@/components/legal/business-contact";
import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";
import { legal } from "@/config/legal";
import { siteConfig } from "@/config/site";

export const metadata = simpleMetadata(
  "Shipping Policy",
  "Delivery timelines, charges and coverage for GadgetCenter orders.",
);

export default function ShippingPage() {
  return (
    <SimplePage
      title="Shipping Policy"
      description={`Last updated: ${legal.lastUpdated}. GadgetCenter ships physical products from ${legal.shipsFrom} to addresses in ${legal.deliveryArea}.`}
    >
      <h2>Where we ship</h2>
      <p>
        We deliver prepaid orders across India to the address you enter at checkout. We do not currently ship
        outside India. Service and installation jobs are fulfilled at the agreed site after we confirm the booking.
      </p>
      <h2>Shipping charges</h2>
      <p>
        Listed products on gadgetcenter.in include free shipping to serviceable Indian pincodes when you pay
        online. If a remote location needs a special courier, we will tell you the extra charge before dispatch
        and will not ship until you agree.
      </p>
      <h2>Processing and delivery time</h2>
      <ul>
        <li>Orders paid by 3:00 PM IST on a working day are usually packed the same or next working day.</li>
        <li>Most pin codes receive the parcel in 3–7 working days after dispatch.</li>
        <li>Remote or northeast pin codes may take 7–10 working days.</li>
        <li>Sundays and public holidays are not counted as working days.</li>
      </ul>
      <p>
        These are estimates. Courier delays, weather, strikes or incomplete addresses can add time. Tracking
        details are shared on call, WhatsApp or email once the courier is assigned.
      </p>
      <h2>What we need from you</h2>
      <p>
        Provide a complete address, pincode and a reachable mobile number. If the courier cannot deliver because
        the address is incomplete or nobody is available, the parcel may return to Kolhapur. Re-shipping may be
        chargeable.
      </p>
      <h2>Inspection on delivery</h2>
      <p>
        Please check the outer carton before you accept it. If it is badly damaged, refuse delivery and contact
        us at {siteConfig.contact.orderPhone} or {siteConfig.contact.email} the same day with photos.
      </p>
      <h2>Title and risk</h2>
      <p>
        Risk in the goods passes to you when the courier records delivery at your address. Ownership passes when
        payment is captured and the goods are delivered.
      </p>
      <BusinessContact heading="Shipping help" />
    </SimplePage>
  );
}

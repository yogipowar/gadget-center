import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";

export const metadata = simpleMetadata(
  "Privacy Policy",
  "How GadgetCenter handles lead, order and browsing information.",
);

export default function PrivacyPage() {
  return (
    <SimplePage
      title="Privacy Policy"
      description="We collect only what is needed to respond to enquiries and fulfil orders."
    >
      <p>
        Lead forms store your name, mobile number, address and optional product interest, along with
        campaign parameters if you arrived from an advertisement.
      </p>
      <p>
        Device information such as browser user-agent may be stored with a lead to help our sales
        team. We do not sell personal data.
      </p>
    </SimplePage>
  );
}

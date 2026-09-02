import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";

export const metadata = simpleMetadata(
  "Account",
  "Customer accounts use your mobile number. Order history will appear here after checkout is connected.",
);

export default function AccountPage() {
  return (
    <SimplePage
      title="Your account"
      description="Customer login is mobile-number based. OTP sign-in will be enabled with the customer module."
    >
      <p>Once you place an order, it will show here with its status and lead history if you were captured from an ad.</p>
    </SimplePage>
  );
}

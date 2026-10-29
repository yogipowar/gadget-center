import { AccountScreen } from "@/components/account/account-screen";
import { simpleMetadata } from "@/components/layout/simple-page";

export const metadata = simpleMetadata(
  "Account",
  "Sign in with your mobile and order number to see order status.",
);

export default function AccountPage() {
  return (
    <AccountScreen
      title="Your account"
      description="Use the mobile number and order number from checkout to see payment and delivery status."
    />
  );
}

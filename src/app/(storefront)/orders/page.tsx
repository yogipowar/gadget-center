import { AccountScreen } from "@/components/account/account-screen";
import { simpleMetadata } from "@/components/layout/simple-page";

export const metadata = simpleMetadata("Orders", "Check GadgetCenter order status with your mobile and order number.");

export default function OrdersPage() {
  return (
    <AccountScreen
      title="Order status"
      description="Enter the mobile number and order number from your checkout to see whether payment is pending, reported or confirmed."
    />
  );
}

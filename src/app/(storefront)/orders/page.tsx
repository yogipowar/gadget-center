import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";
import Link from "next/link";

import { routes } from "@/config/routes";

export const metadata = simpleMetadata("Orders", "Your GadgetCenter order history.");

export default function OrdersPage() {
  return (
    <SimplePage
      title="Orders"
      description="Order history will appear here after customer accounts and checkout are connected to MySQL."
    >
      <p>
        <Link href={routes.account} className="font-medium text-foreground underline">
          Go to account
        </Link>
      </p>
    </SimplePage>
  );
}

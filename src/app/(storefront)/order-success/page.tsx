import Link from "next/link";

import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";
import { routes } from "@/config/routes";

export const metadata = simpleMetadata(
  "Payment received",
  "Your online payment succeeded and the order is confirmed.",
);

type OrderSuccessPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const { order } = await searchParams;

  return (
    <SimplePage
      title="Payment received"
      description={
        order
          ? `Order ${order} is confirmed. We will contact you on the mobile number you shared for delivery.`
          : "Your payment is confirmed. We will contact you on the mobile number you shared for delivery."
      }
    >
      <p>
        <Link href={routes.products} className="font-medium text-foreground underline">
          Continue shopping
        </Link>
      </p>
    </SimplePage>
  );
}

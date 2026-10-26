import Link from "next/link";

import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";
import { routes } from "@/config/routes";

export const metadata = simpleMetadata(
  "Order received",
  "Your order has been saved and our team will contact you.",
);

type OrderSuccessPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const { order } = await searchParams;

  return (
    <SimplePage
      title="Order received"
      description={
        order
          ? `Order ${order} is saved. Our team will contact you on the mobile number you shared.`
          : "Your order or enquiry request has been noted. Our team will contact you on the mobile number you shared."
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

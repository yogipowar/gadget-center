import Link from "next/link";

import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export const metadata = simpleMetadata(
  "Order placed",
  "Pay by UPI or bank transfer. We confirm the order after the payment appears.",
);

type OrderSuccessPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const { order } = await searchParams;

  return (
    <SimplePage
      title="Order placed — awaiting payment"
      description={
        order
          ? `Order ${order} is saved. We will confirm it and arrange delivery after your UPI or bank transfer appears in our account.`
          : "Your order is saved. We will confirm it after your UPI or bank transfer appears in our account."
      }
    >
      <p>
        If you have already paid, keep the order number handy. You can also WhatsApp a screenshot to +91{" "}
        {siteConfig.contact.orderPhone}.
      </p>
      <p>
        <Link href={routes.products} className="font-medium text-foreground underline">
          Continue shopping
        </Link>
      </p>
    </SimplePage>
  );
}

import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";
import { routes } from "@/config/routes";
import Link from "next/link";

export const metadata = simpleMetadata(
  "Order received",
  "Your order or enquiry request has been noted.",
);

export default function OrderSuccessPage() {
  return (
    <SimplePage
      title="Request received"
      description="If you placed an enquiry or order request, our team will contact you on the mobile number you shared."
    >
      <p>
        <Link href={routes.products} className="font-medium text-foreground underline">
          Continue shopping
        </Link>
      </p>
    </SimplePage>
  );
}

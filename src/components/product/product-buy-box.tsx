"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useLeadCapture } from "@/components/lead/lead-capture-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { addToCart } from "@/features/cart/store";
import type { CatalogProduct } from "@/features/catalog/types";
import { buildWhatsAppUrl, productEnquiryMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function ProductBuyBox({ product }: { product: CatalogProduct }) {
  const router = useRouter();
  const { openLeadCapture } = useLeadCapture();
  const whatsapp = buildWhatsAppUrl(
    productEnquiryMessage({
      name: product.name,
      condition: product.condition === "REFURBISHED" ? "Refurbished" : "New",
      grade: product.grade === "A_PLUS" ? "Grade A+" : product.grade ? `Grade ${product.grade}` : undefined,
    }),
  );

  function add() {
    addToCart(product.slug);
    toast.success("Added to cart");
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Button className="h-10 px-4" disabled={!product.inStock} onClick={add}>
        Add to Cart
      </Button>
      <Button
        variant="outline"
        className="h-10 px-4"
        disabled={!product.inStock}
        onClick={() => {
          add();
          router.push(routes.cart);
        }}
      >
        Buy Now
      </Button>
      <Button variant="ghost" className="h-10 px-4" onClick={openLeadCapture}>
        Get Expert Help
      </Button>
      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "ghost" }), "h-10 px-4")}
        >
          WhatsApp Enquiry
        </a>
      ) : null}
    </div>
  );
}

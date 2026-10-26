"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useAdminCatalog } from "@/features/admin/catalog-store";
import { cartCount, removeFromCart, updateCartQuantity, useCart } from "@/features/cart/store";
import { getProductBySlug } from "@/features/catalog/queries";
import { formatInr } from "@/utils/currency";

export default function CartPage() {
  const cart = useCart();
  const catalog = useAdminCatalog();
  const lines = cart.items
    .map((item) => {
      const product = getProductBySlug(item.slug, catalog.products);
      if (!product) {
        return null;
      }
      return { product, quantity: item.quantity };
    })
    .filter((line) => line !== null);

  const subtotal = lines.reduce((sum, line) => sum + line.product.salePrice * line.quantity, 0);

  if (lines.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add a laptop or accessory to continue.</p>
        <Link href={routes.products} className="mt-6 inline-block text-sm font-medium underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{cartCount(cart)} item(s)</p>
      <ul className="mt-6 divide-y divide-border rounded-xl border border-border">
        {lines.map(({ product, quantity }) => (
          <li key={product.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{product.brand}</p>
              <Link href={routes.product(product.slug)} className="font-medium hover:underline">
                {product.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {product.condition} · {product.sku}
              </p>
            </div>
            <p className="text-sm font-medium">{formatInr(product.salePrice, { compact: true })}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => updateCartQuantity(product.slug, quantity - 1)}
              >
                -
              </Button>
              <span className="w-6 text-center text-sm">{quantity}</span>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => updateCartQuantity(product.slug, quantity + 1)}
              >
                +
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => removeFromCart(product.slug)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Subtotal</p>
        <p className="text-lg font-semibold">{formatInr(subtotal, { compact: true })}</p>
      </div>
      <Link href={routes.checkout}>
        <Button className="mt-4 h-10 px-5">Pay online</Button>
      </Link>
    </div>
  );
}

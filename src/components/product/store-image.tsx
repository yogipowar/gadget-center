import Image, { type ImageProps } from "next/image";

import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";

function skipOptimize(src: string) {
  return (
    /^(https?:)?\/\//i.test(src) ||
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.includes("/api/v1/media/")
  );
}

function useNativeImg(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:");
}

export function StoreImage({ src, alt, className, fill, sizes, preload, loading, ...rest }: ImageProps) {
  const resolved = typeof src === "string" ? assetPath(src) : src;
  const source = typeof src === "string" ? src : "";

  if (typeof resolved === "string" && useNativeImg(source)) {
    return (
      // Object URLs and data URLs cannot go through next/image.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={alt}
        className={cn(fill ? "absolute inset-0 size-full" : null, className)}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      {...rest}
      src={resolved}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      preload={preload}
      loading={loading}
      unoptimized={typeof source === "string" && skipOptimize(source)}
    />
  );
}

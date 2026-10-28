export const PRODUCT_IMAGE_MAX_BYTES = 4 * 1024 * 1024;
export const PRODUCT_IMAGE_MAX_COUNT = 12;
export const PRODUCT_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

export const PRODUCT_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export type ProductImageMimeType = (typeof PRODUCT_IMAGE_MIME_TYPES)[number];

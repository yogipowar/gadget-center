import "server-only";

import { randomUUID } from "node:crypto";

import { UploadedImage } from "@/database/models/uploaded-image";
import { ensureDatabase } from "@/database/sequelize";
import {
  PRODUCT_IMAGE_MAX_BYTES,
  PRODUCT_IMAGE_MAX_COUNT,
  PRODUCT_IMAGE_MIME_TYPES,
  type ProductImageMimeType,
} from "@/constants/media";
import { NotFoundError, ValidationError } from "@/lib/api/errors";
import { routes } from "@/config/routes";

const MAGIC: Array<{ mime: ProductImageMimeType; test: (bytes: Buffer) => boolean }> = [
  { mime: "image/jpeg", test: (bytes) => bytes.length > 2 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  { mime: "image/png", test: (bytes) => bytes.length > 7 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 },
  { mime: "image/gif", test: (bytes) => bytes.length > 5 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 },
  {
    mime: "image/webp",
    test: (bytes) =>
      bytes.length > 11 &&
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP",
  },
  {
    mime: "image/avif",
    test: (bytes) => bytes.length > 11 && bytes.toString("ascii", 4, 8) === "ftyp" && bytes.toString("ascii", 8, 12).startsWith("avif"),
  },
];

function detectMime(bytes: Buffer, reported: string): ProductImageMimeType | null {
  const matched = MAGIC.find((item) => item.test(bytes));
  if (matched) {
    return matched.mime;
  }
  return PRODUCT_IMAGE_MIME_TYPES.includes(reported as ProductImageMimeType)
    ? (reported as ProductImageMimeType)
    : null;
}

function toBuffer(value: unknown): Buffer {
  if (Buffer.isBuffer(value)) {
    return value;
  }
  if (value instanceof Uint8Array) {
    return Buffer.from(value);
  }
  if (typeof value === "string") {
    return Buffer.from(value, "binary");
  }
  throw new NotFoundError("Image not found.");
}

export type SavedProductImage = {
  id: string;
  url: string;
  mimeType: string;
};

export async function saveUploadedImages(files: File[]) {
  await ensureDatabase();
  if (files.length === 0) {
    throw new ValidationError("Choose at least one image.");
  }
  if (files.length > PRODUCT_IMAGE_MAX_COUNT) {
    throw new ValidationError(`You can upload at most ${PRODUCT_IMAGE_MAX_COUNT} images at a time.`);
  }

  const saved: SavedProductImage[] = [];
  for (const file of files) {
    if (file.size <= 0) {
      throw new ValidationError("One of the files is empty.");
    }
    if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
      throw new ValidationError("Each image must be 4 MB or smaller.");
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const mimeType = detectMime(bytes, file.type);
    if (!mimeType) {
      throw new ValidationError("Use JPEG, PNG, WebP, GIF or AVIF images.");
    }
    const row = await UploadedImage.create({
      id: randomUUID(),
      mimeType,
      originalName: file.name.slice(0, 200),
      bytes,
    });
    saved.push({
      id: row.id,
      url: routes.api.media(row.id),
      mimeType: row.mimeType,
    });
  }
  return saved;
}

export async function getUploadedImage(id: string) {
  await ensureDatabase();
  const row = await UploadedImage.findByPk(id);
  if (!row) {
    throw new NotFoundError("Image not found.");
  }
  return {
    id: row.id,
    mimeType: row.mimeType,
    bytes: toBuffer(row.bytes),
  };
}

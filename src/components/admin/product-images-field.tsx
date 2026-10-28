"use client";

import { useRef, useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { StoreImage } from "@/components/product/store-image";
import { Button } from "@/components/ui/button";
import { PRODUCT_IMAGE_ACCEPT, PRODUCT_IMAGE_MAX_COUNT } from "@/constants/media";
import { routes } from "@/config/routes";
import { apiClient } from "@/lib/api/client";

type UploadedImageResponse = {
  id: string;
  url: string;
  mimeType: string;
};

export function ProductImagesField({
  images,
  onChange,
  onBusyChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function setBusy(next: boolean) {
    setUploading(next);
    onBusyChange?.(next);
  }

  async function onPick(fileList: FileList | null) {
    const files = fileList ? [...fileList] : [];
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (files.length === 0) {
      return;
    }
    const remaining = PRODUCT_IMAGE_MAX_COUNT - images.length;
    if (remaining <= 0) {
      toast.error(`You can add up to ${PRODUCT_IMAGE_MAX_COUNT} images.`);
      return;
    }
    const selected = files.slice(0, remaining);
    if (files.length > remaining) {
      toast.error(`Only ${remaining} more image${remaining === 1 ? "" : "s"} can be added.`);
    }
    setBusy(true);
    try {
      const formData = new FormData();
      for (const file of selected) {
        formData.append("files", file);
      }
      const response = await apiClient.postForm<UploadedImageResponse[]>(routes.api.adminUploads, formData);
      if (!response.success || !response.data?.length) {
        throw new Error(response.message || "Could not upload images.");
      }
      onChange([...images, ...response.data.map((item) => item.url)]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload images.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-1.5 text-sm">
      <span className="font-medium">Product images</span>
      <p className="text-xs text-muted-foreground">
        Upload one or more photos. The first image is the cover used on listing cards.
      </p>
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((src, index) => (
            <div key={`${src}-${index}`} className="relative overflow-hidden rounded-lg border bg-zinc-50">
              <div className="relative aspect-square">
                <StoreImage src={src} alt="" fill sizes="120px" className="object-contain p-1" />
              </div>
              {index === 0 ? (
                <span className="absolute top-1 left-1 rounded bg-foreground/80 px-1.5 py-0.5 text-[10px] font-medium text-background">
                  Cover
                </span>
              ) : null}
              <div className="flex justify-between gap-1 p-1">
                {index === 0 ? (
                  <span className="px-1 text-[11px] text-muted-foreground">Cover</span>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => onChange([src, ...images.filter((item, itemIndex) => itemIndex !== index)])}
                  >
                    <Star className="size-3" />
                    Cover
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Remove image"
                  onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
          No images yet. Add photos of the unit, ports, keyboard and screen.
        </p>
      )}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept={PRODUCT_IMAGE_ACCEPT}
          multiple
          className="sr-only"
          onChange={(event) => void onPick(event.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading || images.length >= PRODUCT_IMAGE_MAX_COUNT}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="size-4" />
          {uploading ? "Uploading…" : "Upload images"}
        </Button>
      </div>
    </div>
  );
}

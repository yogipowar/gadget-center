"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { visiblePages, type PaginationMeta } from "@/utils/pagination";

export function PaginationBar({
  meta,
  onPageChange,
  noun = "results",
  showSummary = true,
  className,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  noun?: string;
  showSummary?: boolean;
  className?: string;
}) {
  const summary =
    meta.total === 0
      ? `No ${noun}`
      : `Showing ${meta.from}–${meta.to} of ${meta.total} ${noun}`;

  if (meta.totalPages <= 1) {
    return showSummary ? <p className={cn("text-sm text-muted-foreground", className)}>{summary}</p> : null;
  }

  const pages = visiblePages(meta.page, meta.totalPages);

  return (
    <nav
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center",
        showSummary ? "sm:justify-between" : "sm:justify-center lg:justify-start",
        className,
      )}
      aria-label="Pagination"
    >
      {showSummary ? <p className="text-sm text-muted-foreground">{summary}</p> : null}
      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft />
          Previous
        </Button>
        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-1.5 text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              variant={item === meta.page ? "default" : "outline"}
              size="sm"
              aria-current={item === meta.page ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          ),
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}

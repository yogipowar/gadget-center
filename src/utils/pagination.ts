export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  from: number;
  to: number;
};

export type PageSlice<T> = PaginationMeta & {
  items: T[];
};

export function paginate<T>(items: T[], page: number, pageSize: number): PageSlice<T> {
  const total = items.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const current = totalPages === 0 ? 1 : Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    pageSize,
    total,
    totalPages,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, total),
  };
}

export function visiblePages(page: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const picked = new Set([1, totalPages, page - 1, page, page + 1]);
  if (page <= 3) {
    picked.add(2);
    picked.add(3);
    picked.add(4);
  }
  if (page >= totalPages - 2) {
    picked.add(totalPages - 3);
    picked.add(totalPages - 2);
    picked.add(totalPages - 1);
  }

  const sorted = [...picked].filter((value) => value >= 1 && value <= totalPages).sort((left, right) => left - right);
  const pages: Array<number | "ellipsis"> = [];
  let last = 0;
  for (const value of sorted) {
    if (last && value - last > 1) {
      pages.push("ellipsis");
    }
    pages.push(value);
    last = value;
  }
  return pages;
}

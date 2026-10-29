"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { PaginationBar } from "@/components/pagination-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { paginate } from "@/utils/pagination";

export type AdminColumn<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

export function AdminTable<T>({
  rows,
  columns,
  searchPlaceholder,
  searchText,
  empty,
  toolbar,
  getRowId,
  selectedIds,
  onSelectedIdsChange,
  onRowClick,
  pageSize,
}: {
  rows: T[];
  columns: AdminColumn<T>[];
  searchPlaceholder?: string;
  searchText: (row: T) => string;
  empty: string;
  toolbar?: ReactNode;
  getRowId?: (row: T) => string;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  onRowClick?: (row: T) => void;
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return rows;
    }
    return rows.filter((row) => searchText(row).toLowerCase().includes(needle));
  }, [query, rows, searchText]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const paged = pageSize ? paginate(filtered, page, pageSize) : paginate(filtered, 1, Math.max(filtered.length, 1));
  const visibleRows = pageSize ? paged.items : filtered;
  const selectable = Boolean(getRowId && onSelectedIdsChange);
  const selected = new Set(selectedIds ?? []);
  const visibleIds = selectable && getRowId ? visibleRows.map((row) => getRowId(row)) : [];
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const colSpan = columns.length + (selectable ? 1 : 0);

  function toggle(id: string) {
    if (!onSelectedIdsChange) {
      return;
    }
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectedIdsChange([...next]);
  }

  function toggleAllVisible() {
    if (!onSelectedIdsChange) {
      return;
    }
    if (allVisibleSelected) {
      const drop = new Set(visibleIds);
      onSelectedIdsChange((selectedIds ?? []).filter((id) => !drop.has(id)));
      return;
    }
    const next = new Set(selectedIds ?? []);
    for (const id of visibleIds) {
      next.add(id);
    }
    onSelectedIdsChange([...next]);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder ?? "Search"}
          className="max-w-sm"
        />
        {toolbar}
      </div>
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable ? (
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    aria-label="Select all visible rows"
                    checked={allVisibleSelected}
                    onChange={toggleAllVisible}
                  />
                </TableHead>
              ) : null}
              {columns.map((column) => (
                <TableHead key={column.header} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="py-10 text-center text-muted-foreground">
                  {empty}
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row, index) => {
                const id = getRowId?.(row);
                return (
                  <TableRow
                    key={id ?? index}
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {selectable && id ? (
                      <TableCell className="w-10">
                        <input
                          type="checkbox"
                          aria-label="Select row"
                          checked={selected.has(id)}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() => toggle(id)}
                        />
                      </TableCell>
                    ) : null}
                    {columns.map((column) => (
                      <TableCell key={column.header} className={column.className}>
                        {column.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {pageSize ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <PaginationBar
            className="flex-1 text-xs"
            meta={paged}
            onPageChange={setPage}
          />
          {selectable && selected.size > 0 ? (
            <p className="text-xs text-muted-foreground">{selected.size} selected</p>
          ) : null}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {rows.length}
          {selectable && selected.size > 0 ? ` · ${selected.size} selected` : ""}
        </p>
      )}
    </div>
  );
}

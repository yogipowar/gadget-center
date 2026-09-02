import type { ApiErrorItem, ApiMeta, ApiResponse } from "@/types/api";

export function success<T>(
  data: T,
  message = "OK",
  meta?: ApiMeta,
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    errors: [],
    ...(meta ? { meta } : {}),
  };
}

export function failure(
  message: string,
  errors: ApiErrorItem[] = [],
  meta?: ApiMeta,
): ApiResponse<null> {
  return {
    success: false,
    message,
    data: null,
    errors,
    ...(meta ? { meta } : {}),
  };
}

export function paginated<T>(
  data: T,
  page: number,
  pageSize: number,
  total: number,
  message = "OK",
): ApiResponse<T> {
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;
  return success(data, message, { page, pageSize, total, totalPages });
}

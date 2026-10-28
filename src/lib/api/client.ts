import type { ApiResponse } from "@/types/api";
import { failure } from "@/lib/api/response";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { body, headers, ...rest } = options;

  const response = await fetch(path, {
    ...rest,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    return failure("Something went wrong. Please try again.") as ApiResponse<T>;
  }
}

async function requestForm<T>(path: string, formData: FormData): Promise<ApiResponse<T>> {
  const response = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    body: formData,
  });
  const text = await response.text();
  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    return failure("Something went wrong. Please try again.") as ApiResponse<T>;
  }
}

export const apiClient = {
  get<T>(path: string, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "POST", body });
  },
  postForm<T>(path: string, formData: FormData) {
    return requestForm<T>(path, formData);
  },
  put<T>(path: string, body?: unknown, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "PUT", body });
  },
  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "PATCH", body });
  },
  delete<T>(path: string, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "DELETE" });
  },
};

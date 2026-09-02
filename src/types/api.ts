export type ApiErrorItem = {
  field?: string;
  code: string;
  message: string;
};

export type ApiMeta = {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
};

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  errors: ApiErrorItem[];
  meta?: ApiMeta;
};

export type ApiFailure = {
  success: false;
  message: string;
  data: null;
  errors: ApiErrorItem[];
  meta?: ApiMeta;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

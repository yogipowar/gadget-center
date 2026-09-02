import type { ApiErrorItem } from "@/types/api";

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly errors: ApiErrorItem[];

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_ERROR",
    errors: ApiErrorItem[] = [],
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors.length > 0 ? errors : [{ code, message }];
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", errors: ApiErrorItem[] = []) {
    super(message, 422, "VALIDATION_ERROR", errors);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429, "RATE_LIMITED");
    this.name = "RateLimitError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

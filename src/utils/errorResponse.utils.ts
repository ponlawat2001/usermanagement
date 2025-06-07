import { Elysia } from "elysia";
import { ResponseHandler } from "../utils/response.utils";

export const errorHandler = new Elysia().onError(
  ({ code, error, set }: { code: any; error: any; set: any }) => {
    console.error(`[${code}]`, error);

    // Handle custom error names
    switch (error.name || code) {
      case "NOT_FOUND":
        set.status = 404;
        return ResponseHandler.notFound(error.message || "Resource not found");

      case "VALIDATION":
        set.status = 400;
        return ResponseHandler.validationError(
          error.message || "Validation error",
        );

      case "UNAUTHORIZED":
        set.status = 401;
        return ResponseHandler.unauthorized(
          error.message || "Unauthorized access",
        );

      case "FORBIDDEN":
        set.status = 403;
        return ResponseHandler.forbidden(error.message || "Access forbidden");

      case "PARSE":
        set.status = 400;
        return ResponseHandler.validationError("Invalid request format");

      default:
        set.status = 500;
        return ResponseHandler.serverError(
          process.env.NODE_ENV === "production"
            ? "An internal server error occurred"
            : error.message || "Internal server error",
        );
    }
  },
);

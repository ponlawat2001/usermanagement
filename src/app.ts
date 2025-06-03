import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";

import { UserController } from "./controllers/user/user.controller";
import { AuthController } from "./controllers/auth/auth.controller";
import { ResponseHandler } from "./utils/response.utils";
import { rateLimit } from "./middlewares/rate-limit.middleware";
import swaggerConfig from "./configs/swagger.config.json";
import { extractUser } from "./middlewares/auth.middleware";

export const app = new Elysia()
  // === GLOBAL MIDDLEWARE SETUP ===
  .use(
    cors({
      origin: ["http://localhost:*", "https://*.example.com"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  .use(
    rateLimit({
      max: 100,
      windowMs: 60 * 1000,
      message: "Too many requests from this IP, please try again later",
    })
  )
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "your-secret-key",
    })
  )
  .derive(({ headers, jwt }) => extractUser({ headers, jwt }))
  // === PUBLIC ENDPOINTS ===
  .group("", (app) =>
    app
      .get(
        "/",
        () => {
          return ResponseHandler.success(
            {
              name: "User Management API",
              version: "1.0.0",
              description: "API for user management and authentication",
              docs: "/docs",
              endpoints: {
                auth: "/api/v1/auth/* - Authentication endpoints",
                users: "/api/v1/users/* - User management endpoints",
              },
              status: "online",
            },
            "Welcome to User Management API"
          );
        },
        {
          detail: {
            summary: "API Information",
            description: "Get general information about the API",
            tags: ["General"],
          },
        }
      )
      .get(
        "/health",
        () => {
          return ResponseHandler.success(
            {
              status: "healthy",
              timestamp: new Date().toISOString(),
              uptime: process.uptime(),
            },
            "Service is healthy"
          );
        },
        {
          detail: {
            summary: "Health Check",
            description: "Check service health status",
            tags: ["General"],
          },
        }
      )
  )

  // === DOCUMENTATION ===
  .use(swagger(swaggerConfig))

  // === API VERSION 1 ===
  .group("/api/v1", (app) =>
    app
      // Authentication routes
      .group("/auth", (app) => app.use(AuthController))

      // User management routes
      .group("/users", (app) => app.use(UserController))
  )

  // === ADMIN PANEL (if needed) ===
  .group("/admin", (app) =>
    app
      // Admin-specific endpoints can go here
      .get(
        "/stats",
        () => {
          return ResponseHandler.success(
            {
              totalRequests: 0, // Add real stats
              activeUsers: 0,
              systemInfo: {
                nodeVersion: process.version,
                platform: process.platform,
              },
            },
            "Admin statistics"
          );
        },
        {
          detail: {
            summary: "Admin Statistics",
            description: "Get system statistics (Admin only)",
            tags: ["Admin"],
          },
        }
      )
  )

  // === GLOBAL ERROR HANDLING ===
  .onError(({ code, error }) => {
    console.error(`[${code}]`, error);

    switch (code) {
      case "NOT_FOUND":
        return ResponseHandler.notFound("Endpoint not found");

      case "VALIDATION":
        return ResponseHandler.validationError(
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Validation error"
        );

      case "PARSE":
        return ResponseHandler.validationError("Invalid request format");

      case "INTERNAL_SERVER_ERROR":
      default:
        return ResponseHandler.serverError(
          process.env.NODE_ENV === "production"
            ? "An internal server error occurred"
            : typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Internal server error"
        );
    }
  });

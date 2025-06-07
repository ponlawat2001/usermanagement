import { Elysia } from "elysia";
import { ResponseHandler } from "../utils/response.utils";

export const generalRoutes = new Elysia()
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
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage(),
          environment: process.env.NODE_ENV || "development",
          version: process.env.npm_package_version || "unknown",
          bun: process.versions.bun || "unknown",
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
  );
import { Elysia } from "elysia";
import { ResponseHandler } from "../utils/response.utils";

export const adminRoutes = new Elysia({ prefix: "/admin" })
  .get(
    "/stats",
    () => {
      return ResponseHandler.success(
        {
          totalRequests: 0,
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
  );
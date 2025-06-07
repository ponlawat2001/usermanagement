import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { rateLimit } from "./middlewares/rate-limit.middleware";
import { extractUser } from "./middlewares/auth.middleware";
import { routes } from "./routers/index.route";
import { errorHandler } from "./utils/errorResponse.utils";
import { swaggerConfig } from "./configs/swagger.config";

export const app = new Elysia()
  // === GLOBAL MIDDLEWARE SETUP ===
  .use(
    cors({
      origin: ["http://localhost:*", "https://*.example.com"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .use(
    rateLimit({
      max: 100,
      windowMs: 60 * 1000,
      message: "Too many requests from this IP, please try again later",
    }),
  )
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "your-secret-key",
    }),
  )
  // === Header Extractor HANDLER ===
  .derive(({ headers, jwt }) => extractUser({ headers, jwt }))

  // === DOCUMENTATION ===
  .use(swagger(swaggerConfig))

  // === ROUTE REGISTRATION ===
  .use(routes)

  // === GLOBAL ERROR HANDLING ===
  .use(errorHandler);

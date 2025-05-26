import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";

import { UserController } from "./controllers/user/user.controller";
import { AuthController } from "./controllers/auth/auth.controller";
import { ResponseHandler } from "./utils/response.utils";
import { rateLimit } from "./middlewares/rate-limit.middleware";

export const app = new Elysia()
  // Enable CORS
  .use(cors({
    origin: ['http://localhost:*', 'https://*.example.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }))
  // Apply rate limiting
  .use(rateLimit({
    max: 100,            // 100 requests
    windowMs: 60 * 1000, // per minute
    message: 'Too many requests from this IP, please try again later'
  }))
  // Welcome endpoint with API information
  .get('/', () => {
    return ResponseHandler.success({
      name: 'User Management API',
      version: '1.0.0',
      description: 'API for user management and authentication',
      docs: '/docs',
      endpoints: {
        auth: '/auth/* - Authentication endpoints',
        users: '/users/* - User management endpoints'
      },
      status: 'online'
    }, 'Welcome to User Management API');
  }, {
    detail: {
      summary: 'API Information',
      description: 'Get general information about the API',
      tags: ['General']
    }
  })
  // Enable Swagger documentation
  .use(
    swagger({
      documentation: {
        info: {
          title: "User Management API",
          version: "1.0.0",
          description: "API for user management and authentication in the system",
          contact: {
            name: "API Support",
            email: "support@example.com",
            url: "https://example.com/support"
          },
          license: {
            name: "MIT",
            url: "https://opensource.org/licenses/MIT"
          }
        },
        tags: [
          {
            name: "Users",
            description: "User management endpoints"
          },
          {
            name: "Authentication",
            description: "Authentication related endpoints"
          }
        ],
        servers: [
          {
            url: "http://localhost:3400",
            description: "Development server"
          }
        ]
      },
      path: "/docs",  // Path to access Swagger UI
      swaggerOptions: {
        persistAuthorization: true  // Keep authorization credentials
      }
    })
  )
  .use([UserController, AuthController])
  .onError(({ code, error }) => {
    console.error(`[${code}]`, error);
    
    // จัดการ error แต่ละประเภท
    switch (code) {
      case 'NOT_FOUND':
        return ResponseHandler.notFound("Endpoint not found");
      
      case 'VALIDATION':
        return ResponseHandler.validationError(
          typeof error === 'object' && error !== null && 'message' in error 
            ? String(error.message) 
            : "Validation error"
        );
      
      case 'PARSE':
        return ResponseHandler.validationError("Invalid request format");
      
      case 'INTERNAL_SERVER_ERROR':
      default:
        return ResponseHandler.serverError(
          process.env.NODE_ENV === 'production' 
            ? "An internal server error occurred" 
            : (typeof error === 'object' && error !== null && 'message' in error 
                ? String(error.message) 
                : "Internal server error")
        );
    }
  });

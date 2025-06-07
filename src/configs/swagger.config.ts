export const swaggerConfig = {
  documentation: {
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "API for user management and authentication in the system",
      contact: {
        name: "API Support",
        email: "support@example.com",
        url: "https://example.com/support",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "Authentication related endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
    ],
    servers: [
      {
        url: "http://localhost:3400/",
        description: "Development server",
      },
    ],
  },
  path: "/docs",
  swaggerOptions: {
    persistAuthorization: true,
    tagsSorter: "alpha",
  },
};

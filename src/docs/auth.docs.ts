import { t } from "elysia";
import {
  loginSuccessExample,
  notFoundExample,
  refreshTokenExample,
  serverErrorExample,
  successNoDataExample,
  unauthorizedExample,
  validationErrorExample,
} from "../configs/swagger-examples";
import { SwaggerDetails } from "../interfaces/swagger";

export const loginSchemaUserDocs = {
  summary: "User login",
  description: "Authenticate a user and return a session token",
  tags: ["Authentication"],
  responses: {
    "200": {
      description: "Login successful",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Object({
              accessToken: t.String(),
              refreshToken: t.String(),
              user: t.Object({
                id: t.String(),
                username: t.String(),
                email: t.String(),
                role: t.String(),
              }),
            }),
          }),
          example: loginSuccessExample,
        },
      },
    },
    "401": {
      description: "Invalid credentials",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: unauthorizedExample,
        },
      },
    },
    "500": {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: serverErrorExample,
        },
      },
    },
  },
} as SwaggerDetails | any;

export const refreshTokenSchemaDocs = {
  summary: "Refresh access token",
  description: "Generate a new access token using a valid refresh token",
  tags: ["Authentication"],
  responses: {
    "200": {
      description: "Token refreshed successfully",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Object({
              accessToken: t.String(),
            }),
          }),
          example: refreshTokenExample,
        },
      },
    },
    "401": {
      description: "Invalid or expired refresh token",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: unauthorizedExample,
        },
      },
    },
    "500": {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: serverErrorExample,
        },
      },
    },
  },
} as SwaggerDetails | any;

export const logoutSchemaDocs = {
  summary: "User logout",
  description: "Invalidate the user's session and refresh token",
  tags: ["Authentication"],
  responses: {
    "200": {
      description: "Logout successful",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: successNoDataExample,
        },
      },
    },
    "401": {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: unauthorizedExample,
        },
      },
    },
    "500": {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: serverErrorExample,
        },
      },
    },
  },
} as SwaggerDetails | any;

export const changePasswordSchemaDocs = {
  summary: "Change password",
  description: "Change user password with validation",
  tags: ["Authentication"],
  responses: {
    "200": {
      description: "Password changed successfully",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: successNoDataExample,
        },
      },
    },
    "401": {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: unauthorizedExample,
        },
      },
    },
    "422": {
      description:
        "Validation error (passwords do not match or incorrect current password)",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: validationErrorExample,
        },
      },
    },
    "404": {
      description: "User not found",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: notFoundExample,
        },
      },
    },
    "500": {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: serverErrorExample,
        },
      },
    },
  },
} as SwaggerDetails | any;

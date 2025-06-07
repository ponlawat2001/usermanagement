import { t } from "elysia";
import {
  userSuccessExample,
  usersListExample,
  userCreatedExample,
  notFoundExample,
  unauthorizedExample,
  forbiddenExample,
  validationErrorExample,
  serverErrorExample,
} from "../configs/swagger-examples";
import { SwaggerDetails } from "../interfaces/swagger";

/**
 * Swagger documentation for User endpoints
 */

// Documentation for GET /users/findAll
export const getAllUsersDocs = {
  summary: "Get all users",
  description: "Retrieve a list of all active users in the system",
  tags: ["Users"],
  responses: {
    "200": {
      description: "List of users retrieved successfully",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Array(
              t.Object({
                id: t.String(),
                username: t.String(),
                fullname: t.String(),
                email: t.String(),
                createdAt: t.String(),
                updatedAt: t.String(),
                isActive: t.Boolean(),
                role: t.Optional(t.String()),
              }),
            ),
          }),
          example: usersListExample,
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
    "403": {
      description: "User does not have admin privileges",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: forbiddenExample,
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

// Documentation for GET /users/:id
export const getUserByIdDocs = {
  summary: "Get user by ID",
  description: "Retrieve a specific user by their unique identifier",
  tags: ["Users"],
  responses: {
    "200": {
      description: "User retrieved successfully",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Object({
              id: t.String(),
              username: t.String(),
              fullname: t.String(),
              email: t.String(),
              createdAt: t.String(),
              updatedAt: t.String(),
              isActive: t.Boolean(),
              role: t.Optional(t.String()),
            }),
          }),
          example: userSuccessExample,
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

export const getMe = {
  summary: "Get current user",
  description: "Retrieve the currently authenticated user's information",
  tags: ["Users"],
  responses: {
    "200": {
      description: "Current user retrieved successfully",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Object({
              id: t.String(),
              username: t.String(),
              fullname: t.String(),
              email: t.String(),
              createdAt: t.String(),
              updatedAt: t.String(),
              isActive: t.Boolean(),
              role: t.Optional(t.String()),
            }),
          }),
          example: userSuccessExample,
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

// Documentation for parameters of GET /users/:id
export const getUserByIdParams = t.Object({
  id: t.String({ description: "The unique identifier of the user" }),
}) as SwaggerDetails | any;

// Documentation for POST /users/register
export const createUserDocs = {
  summary: "Create new user",
  description: "Register a new user in the system",
  tags: ["Users"],
  responses: {
    "201": {
      description: "User created successfully",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Object({
              id: t.String(),
              username: t.String(),
              fullname: t.String(),
              email: t.String(),
              createdAt: t.String(),
              updatedAt: t.String(),
              isActive: t.Boolean(),
              role: t.String(),
            }),
          }),
          example: userCreatedExample,
        },
      },
    },
    "400": {
      description: "Validation failed or username/email already exists",
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

// Documentation for PATCH /users/:id
export const updateUserDocs = {
  summary: "Update user",
  description: "Update an existing user's information",
  tags: ["Users"],
  responses: {
    "200": {
      description: "User updated successfully",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Object({
              id: t.String(),
              username: t.String(),
              fullname: t.String(),
              email: t.String(),
              createdAt: t.String(),
              updatedAt: t.String(),
              isActive: t.Boolean(),
              role: t.Optional(t.String()),
            }),
          }),
          example: userSuccessExample,
        },
      },
    },
    "400": {
      description: "Validation failed or username/email already exists",
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

// Documentation for parameters of PATCH /users/:id
export const updateUserParams = t.Object({
  id: t.String({ description: "The unique identifier of the user to update" }),
});

// Documentation for DELETE /users/:id
export const deleteUserDocs = {
  summary: "Delete user",
  description: "Delete an existing user from the system",
  tags: ["Users"],
  responses: {
    "200": {
      description: "User deleted successfully",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: {
            status: 200,
            message: "User deleted successfully",
            data: null,
          },
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
    "403": {
      description: "User does not have admin privileges",
      content: {
        "application/json": {
          schema: t.Object({
            status: t.Number(),
            message: t.String(),
            data: t.Null(),
          }),
          example: forbiddenExample,
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

// Documentation for parameters of DELETE /users/:id
export const deleteUserParams = t.Object({
  id: t.String({ description: "The unique identifier of the user to delete" }),
});

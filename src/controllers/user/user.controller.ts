import Elysia from "elysia";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";

import {
  getAllUsersDocs,
  getUserByIdDocs,
  getUserByIdParams,
  createUserDocs,
  updateUserDocs,
  updateUserParams,
  deleteUserDocs,
  deleteUserParams,
  getMe,
} from "../../docs/user.docs";

import {
  createSchemaUser,
  updateSchemaUser,
} from "../../validations/user.validation";
import { ResponseHandler } from "../../utils/response.utils";
import { UserService } from "../../services/user/user.service";
import { authProfile } from "../../interfaces/auth";

const userService = new UserService();

export const UserController = new Elysia()
  .get(
    "/findAll",
    async ({ set }) => {
      const users = await userService.findAll();
      if (!users || users.length === 0) {
        set.status = 404; // Not Found
        return ResponseHandler.notFound("No users found");
      }
      return ResponseHandler.success(users, "Users retrieved successfully");
    },
    {
      detail: getAllUsersDocs,
      beforeHandle: (context: any) => requireRole(context.user, "admin"),
    },
  )

  .get(
    "/:id",
    async ({ params, set }) => {
      console.log("Fetching user by ID:", params.id);
      const user = await userService.findById(params.id);
      if (!user) {
        set.status = 404; // Not Found
        return ResponseHandler.notFound(`User with id ${params.id} not found`);
      }
      set.status = 200; // OK
      return ResponseHandler.success(user, "User retrieved successfully");
    },
    {
      detail: getUserByIdDocs,
      params: getUserByIdParams,
      beforeHandle: (context: any) => requireRole(context.user, "admin"),
    },
  )

  .get(
    "/me",
    async ({ user, set }: { user: authProfile; set: any }) => {
      if (!user) {
        set.status = 401; // Unauthorized
        return ResponseHandler.unauthorized("User not authenticated");
      }
      console.log("Fetching current user:", user);
      const currentUser = await userService.findByUsernameOrEmail(user.name);
      if (!currentUser) {
        set.status = 404; // Not Found
        return ResponseHandler.notFound("Current user not found");
      }
      set.status = 200; // OK
      return ResponseHandler.success(
        currentUser,
        "Current user retrieved successfully",
      );
    },
    {
      detail: getMe,
    },
  )

  // Create new user
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        // Check for existing username or email
        const existingUser = await userService.findByUsernameOrEmail(
          body.username,
        );
        if (existingUser) {
          throw new Error("Username already exists");
        }

        const existingEmail = await userService.findByUsernameOrEmail(
          body.email,
        );
        if (existingEmail) {
          throw new Error("Email already exists");
        }

        const newUser = await userService.createUser(body);
        set.status = 201; // OK
        return ResponseHandler.success(
          newUser,
          "User created successfully",
          201,
        );
      } catch (error: any) {
        // Check error message to provide appropriate response
        if (error.message?.includes("exists")) {
          set.status = 400; // Bad Request
          return ResponseHandler.validationError(
            "Username or email already exists",
          );
        }
        set.status = 500;
        return ResponseHandler.serverError(
          error.message || "Failed to create user",
        );
      }
    },
    {
      body: createSchemaUser, // Using schema from repo for request body validation
      detail: createUserDocs,
    },
  )

  // Update user - Requires authentication
  .patch(
    "/:id",
    async ({ params, body, set }) => {
      try {
        // Check for duplicate email if email is being updated
        if (body.email) {
          const existingUserWithEmail = await userService.findByUsernameOrEmail(
            body.email,
          );
          if (
            existingUserWithEmail &&
            existingUserWithEmail.email === body.email
          ) {
            throw new Error("Email already exists");
          }
        }

        const updatedUser = await userService.updateUser(
          params.id,
          body as any,
        );
        if (!updatedUser) {
          set.status = 400;
          return ResponseHandler.notFound(
            `User with id ${params.id} not found`,
          );
        }
        set.status = 200; // OK
        return ResponseHandler.success(
          updatedUser,
          "User updated successfully",
        );
      } catch (error: any) {
        set.status = 400; // Internal Server Error
        if (error.message?.includes("duplicate")) {
          return ResponseHandler.validationError(
            "Username or email already exists",
          );
        }
        set.status = 500; // Internal Server Error
        return ResponseHandler.serverError(
          error.message || "Failed to update user",
        );
      }
    },
    {
      body: updateSchemaUser,
      params: updateUserParams,
      detail: updateUserDocs,
      beforeHandle: (context: any) => requireAuth(context.user),
    },
  )

  .delete(
    "/:id",
    async ({ params, set }) => {
      if (!params.id) {
        set.status = 400; // Bad Request
        return ResponseHandler.notFound("User ID is required");
      }
      const result = await userService.deleteUser(params.id);
      if (!result) {
        set.status = 404; // Not Found
        return ResponseHandler.notFound(`User with id ${params.id} not found`);
      }
      set.status = 200; // OK
      return ResponseHandler.success(null, "User deleted successfully");
    },
    {
      params: deleteUserParams,
      detail: deleteUserDocs,
      beforeHandle: (context: any) => requireRole(context.user, "admin"),
    },
  );

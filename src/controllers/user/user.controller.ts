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
} from "../../docs/user.docs";

import { createSchemaUser, updateSchemaUser } from "../../spreads/user.spread";
import { ResponseHandler } from "../../utils/response.utils";
import { UserService } from "../../services/user/user.service";
import { User } from "../../interfaces/user";

const userService = new UserService();

export const UserController = new Elysia({ prefix: "/users" })
  // Get all users - Requires authentication and admin role
  .use(requireRole("admin"))
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
    }
  )

  // Get user by ID - Requires authentication
  .use(requireAuth)
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
    }
  )

  // Create new user
  .post(
    "/register",
    async ({ body , set }) => {
      try {
        const newUser = await userService.createUser(body);
        set.status = 201; // OK
        return ResponseHandler.success(
          newUser,
          "User created successfully",
          201
        );
      } catch (error: any) {
        // Check error message to provide appropriate response
        if (error.message?.includes("duplicate")) {
          set.status = 400; // Bad Request
          return ResponseHandler.validationError(
            "Username or email already exists"
          );
        }
        set.status = 500;
        return ResponseHandler.serverError(
          error.message || "Failed to create user"
        );
      }
    },
    {
      body: createSchemaUser, // Using schema from repo for request body validation
      detail: createUserDocs,
    }
  )

  // Update user - Requires authentication
  .patch(
    "/:id",
    async ({ params, body , set }) => {
      try {
        const updatedUser = await userService.updateUser(params.id, body);
        if (!updatedUser) {
          set.status = 400;
          return ResponseHandler.notFound(
            `User with id ${params.id} not found`
          );
        }
        set.status = 200; // OK
        return ResponseHandler.success(
          updatedUser,
          "User updated successfully"
        );
      } catch (error: any) {
        set.status = 400; // Internal Server Error
        if (error.message?.includes("duplicate")) {
          return ResponseHandler.validationError(
            "Username or email already exists"
          );
        }
        set.status = 500; // Internal Server Error
        return ResponseHandler.serverError(
          error.message || "Failed to update user"
        );
      }
    },
    {
      body: updateSchemaUser,
      params: updateUserParams,
      detail: updateUserDocs,
    }
  )

  // Delete user - Requires authentication and admin role
  .use(requireRole("admin"))
  .delete(
    "/:id",
    async ({ params , set }) => {
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
    }
  );

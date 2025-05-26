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

import {
  createSchemaUser,
  updateSchemaUser,
} from "../../schemas/user/user.schema";
import { ResponseHandler } from "../../utils/response.utils";
import { UserService } from "../../services/user/user.service";
import { SwaggerDetails } from "../../interfaces/swagger";
import { User } from "../../interfaces/user";

const userService = new UserService();

export const UserController = new Elysia({ prefix: "/users" })
  // Get all users - Requires authentication and admin role
  .use(requireRole("admin"))
  .get(
    "/findAll",
    async () => {
      const users = await userService.findAll();
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
    async (params: { id: string }) => {
      const user = await userService.findById(params.id);
      if (!user) {
        return ResponseHandler.notFound(`User with id ${params.id} not found`);
      }
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
    async (body: User) => {
      try {
        const newUser = await userService.createUser(body);
        return ResponseHandler.success(
          newUser,
          "User created successfully",
          201
        );
      } catch (error: any) {
        // Check error message to provide appropriate response
        if (error.message?.includes("duplicate")) {
          return ResponseHandler.validationError(
            "Username or email already exists"
          );
        }
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
    async (params: { id: string }, body: User) => {
      try {
        const updatedUser = await userService.updateUser(params.id, body);
        if (!updatedUser) {
          return ResponseHandler.notFound(
            `User with id ${params.id} not found`
          );
        }
        return ResponseHandler.success(
          updatedUser,
          "User updated successfully"
        );
      } catch (error: any) {
        if (error.message?.includes("duplicate")) {
          return ResponseHandler.validationError(
            "Username or email already exists"
          );
        }
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
    async (params: { id: string }) => {
      if (!params.id) {
        return ResponseHandler.notFound("User ID is required");
      }
      const result = await userService.deleteUser(params.id);
      if (!result) {
        return ResponseHandler.notFound(`User with id ${params.id} not found`);
      }
      return ResponseHandler.success(null, "User deleted successfully");
    },
    {
      params: deleteUserParams,
      detail: deleteUserDocs,
    }
  );

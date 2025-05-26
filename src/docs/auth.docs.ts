import { t } from "elysia";
import {
  loginSuccessExample,
  serverErrorExample,
  unauthorizedExample,
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

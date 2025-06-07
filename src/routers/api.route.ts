import { Elysia } from "elysia";
import { UserController } from "../controllers/user/user.controller";
import { AuthController } from "../controllers/auth/auth.controller";

export const apiRoutes = new Elysia({ prefix: "/api/v1" })
  .group("/auth", (app) => app.use(AuthController))
  .group("/users", (app) => app.use(UserController));

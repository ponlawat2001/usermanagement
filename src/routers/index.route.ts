import { generalRoutes } from "./general.route";
import { apiRoutes } from "./api.route";
import { adminRoutes } from "./admin.route";

export const routes = [
  generalRoutes,
  apiRoutes,
  adminRoutes,
];

export { generalRoutes, apiRoutes, adminRoutes };
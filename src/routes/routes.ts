import { Router } from "express";
import { adminRoutes } from "./admin-routes";
import { userRoutes } from "./user-routes";

export function routes() {
  const router = Router();

  router.use("/admin", adminRoutes());
  router.use("/user", userRoutes());

  return router;
}

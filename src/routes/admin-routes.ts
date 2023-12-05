import {
  handleDeleteAllUnverifiedUsers,
  handleGetAllUsers,
  handleGetAllVerifiedUsers,
} from "@/controllers/admin-controllers";
import { authenticate } from "@/middlewares/auth";
import { Router } from "express";

export function adminRoutes() {
  const router = Router();

  router.use(
    authenticate({
      verifyAdmin: true,
    }),
  );

  router.get("/all-users", handleGetAllUsers);
  router.get("/all-verfied-users", handleGetAllVerifiedUsers);
  router.delete("/remove-unverified-users", handleDeleteAllUnverifiedUsers);

  return router;
}

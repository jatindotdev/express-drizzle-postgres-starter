import {
  handleAddUser,
  handleDeleteUser,
  handleGetUser,
  handleUpdateUser,
  handleUserLogin,
  handleVerifyUser,
} from "@/controllers/user-controllers";
import { authenticate } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/validator";
import { addUserSchema, deleteUserSchema, loginSchema, verifyUserSchema } from "@/schema/user";
import { Router } from "express";

export function userRoutes() {
  const router = Router();

  router.get("/", authenticate(), handleGetUser);
  router.get("/verify", validateRequest("query", verifyUserSchema), handleVerifyUser);
  router.post("/create", validateRequest("body", addUserSchema), handleAddUser);
  router.post("/login", validateRequest("body", loginSchema), handleUserLogin);
  router.post("/remove", authenticate(), validateRequest("body", deleteUserSchema), handleDeleteUser);
  router.put("/update", authenticate(), handleUpdateUser);

  return router;
}

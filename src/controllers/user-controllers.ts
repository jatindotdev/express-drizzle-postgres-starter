import { render } from "@react-email/render";
import type { NextFunction, Request, Response } from "express";
import {
  DeleteUserSchemaType,
  LoginSchemaType,
  NewUser,
  UpdateUserSchemaType,
  User,
  VerifyUserSchemaType,
} from "schema/user";
import { UserVerified } from "templates/user-verified";
import { BackendError } from "utils/errors";
import generateToken from "utils/jwt";
import {
  addUser,
  deleteUser,
  getUserByEmail,
  sendVerificationEmail,
  updateUser,
  verifyUser,
} from "../services/user-services";
import { API_BASE_URL } from "../utils/config";

export const handleUserLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as LoginSchemaType;
    const user = await getUserByEmail(email);

    if (!user) {
      throw new BackendError("User not found", 404);
    }

    const matchPassword = password === user.password;
    if (!matchPassword) {
      throw new BackendError("Invalid password", 401);
    }

    const token = generateToken(user.id);
    res.status(200).json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

const handleAddUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body as NewUser;

    const existingUser = await getUserByEmail(user.email);

    if (existingUser) {
      throw new BackendError("User already exists", 409);
    }

    const { user: addedUser, code } = await addUser(user);

    const status = await sendVerificationEmail(API_BASE_URL, addedUser.name, addedUser.email, code);

    if (status !== 200) {
      await deleteUser(addedUser.email);
      throw new BackendError("Failed to signup user", 500);
    }

    res.status(201).json(addedUser);
  } catch (err) {
    next(err);
  }
};

const handleVerifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code } = req.query as VerifyUserSchemaType;
    if (!code) {
      throw new BackendError("No verification code provided", 400);
    }

    await verifyUser(email, code);
    const template = render(UserVerified({ status: "verified", message: "User verified successfully" }));
    res.status(200).send(template);
  } catch (err) {
    if (err instanceof BackendError) {
      const template = render(UserVerified({ status: "invalid", message: err.message, error: "Invalid Request" }));
      res.status(err.code).send(template);
      return;
    }
    next(err);
  }
};

const handleDeleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body as DeleteUserSchemaType;

    const { user } = res.locals as { user: User };

    if (user.email !== email && !user.isAdmin) {
      throw new BackendError("Non-admin users can only delete their own account", 401);
    }

    await deleteUser(email);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export { handleAddUser, handleDeleteUser, handleVerifyUser };

export const handleGetUser = async (req: Request, res: Response) => {
  const { user } = res.locals as { user: User };

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
    success: true,
  });
};

export const handleUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = res.locals as { user: User };

    const { name, password, email } = req.body as UpdateUserSchemaType;

    const updatedUser = await updateUser(user, { name, password, email });

    res.status(200).json({
      user: updatedUser,
      message: "User updated successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

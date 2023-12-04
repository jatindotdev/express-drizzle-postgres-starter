import type { Request, Response } from "express";
import { deleteAllUnverifiedUsers, getAllVerifiedUsers, getAllUsers } from "../services/admin-services";

export const handleGetAllVerifiedUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllVerifiedUsers();
    res.status(200).json({
      users,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const handleGetAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      users,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const handleDeleteAllUnverifiedUsers = async (req: Request, res: Response) => {
  try {
    const unverfiedUsersCount = await deleteAllUnverifiedUsers();
    res.status(200).json({
      message: `${unverfiedUsersCount} unverified users deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

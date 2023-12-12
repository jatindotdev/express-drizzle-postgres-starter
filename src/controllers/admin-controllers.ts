import {
  deleteAllUnverifiedUsers,
  getAllUsers,
  getAllVerifiedUsers,
} from '@/services/admin-services';
import type { Request, Response } from 'express';

export const handleGetAllVerifiedUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllVerifiedUsers();
    res.status(200).json({
      users,
      success: true,
    });
  } catch (_err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const handleGetAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      users,
      success: true,
    });
  } catch (_err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const handleDeleteAllUnverifiedUsers = async (_req: Request, res: Response) => {
  try {
    const unverfiedUsersCount = await deleteAllUnverifiedUsers();
    res.status(200).json({
      message: `${unverfiedUsersCount} unverified users deleted successfully`,
    });
  } catch (_err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

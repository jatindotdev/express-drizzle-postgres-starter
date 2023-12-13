import {
  deleteAllUnverifiedUsers,
  getAllUsers,
  getAllVerifiedUsers,
} from '@/services/admin-services';
import { createHandler } from '@/utils/create';

export const handleGetAllVerifiedUsers = createHandler(async ({ res }) => {
  const users = await getAllVerifiedUsers();
  res.status(200).json({
    success: true,
    users,
  });
});

export const handleGetAllUsers = createHandler(async ({ res }) => {
  const users = await getAllUsers();
  res.status(200).json({
    users,
    success: true,
  });
});

export const handleDeleteAllUnverifiedUsers = createHandler(async ({ res }) => {
  const unverfiedUsersCount = await deleteAllUnverifiedUsers();
  res.status(200).json({
    message: `${unverfiedUsersCount} unverified users deleted successfully`,
  });
});

import { users } from '@/schema/user';
import { db } from '@/utils/db';
import { and, eq } from 'drizzle-orm';

export const getAllVerifiedUsers = async () => {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      isVerified: users.isVerified,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(eq(users.isVerified, true), eq(users.isAdmin, false)));
};

export const getAllUsers = async () => {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      isVerified: users.isVerified,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
    })
    .from(users);
};

export const deleteAllUnverifiedUsers = async () => {
  const deletedUsers = await db
    .delete(users)
    .where(eq(users.isVerified, false))
    .returning();
  return deletedUsers.length;
};

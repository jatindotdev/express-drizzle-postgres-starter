import { and, eq } from 'drizzle-orm';
import { users } from '@/schema/user';
import { db } from '@/utils/db';

export async function getAllVerifiedUsers() {
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
}

export async function getAllUsers() {
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
}

export async function deleteAllUnverifiedUsers() {
  const deletedUsers = await db
    .delete(users)
    .where(eq(users.isVerified, false))
    .returning();
  return deletedUsers.length;
}

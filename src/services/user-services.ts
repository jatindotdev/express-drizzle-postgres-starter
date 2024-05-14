import process from 'node:process';
import crypto from 'node:crypto';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { type NewUser, type UpdateUser, type User, users } from '@/schema/user';
import { db } from '@/utils/db';
import { sendVerificationEmail } from '@/utils/email';
import { BackendError } from '@/utils/errors';
import { sha256 } from '@/utils/hash';

export async function getUserByUserId(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
}

export async function addUser(user: NewUser) {
  const { password, ...userDetails } = user;

  const salt = crypto.randomBytes(32);
  const code = crypto.randomBytes(32).toString('hex');
  const hashedPassword = await argon2.hash(password, {
    salt,
  });

  const [newUser] = await db
    .insert(users)
    .values({
      ...userDetails,
      password: hashedPassword,
      salt: salt.toString('hex'),
      code,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      code: users.code,
      isVerified: users.isVerified,
      isAdmin: users.isAdmin,
    });

  if (!newUser) {
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to add user',
    });
  }

  return { user: newUser, code };
}

export async function verifyUser(email: string, code: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user)
    throw new BackendError('USER_NOT_FOUND');

  if (user.isVerified) {
    throw new BackendError('CONFLICT', {
      message: 'User already verified',
    });
  }

  const isVerified = sha256.verify(code, user.code);

  if (!isVerified) {
    throw new BackendError('UNAUTHORIZED', {
      message: 'Invalid verification code',
    });
  }

  const [updatedUser] = await db
    .update(users)
    .set({ isVerified })
    .where(eq(users.email, email))
    .returning({ id: users.id });

  if (!updatedUser) {
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to verify user',
    });
  }
}

export async function deleteUser(email: string) {
  const user = await getUserByEmail(email);

  if (!user)
    throw new BackendError('USER_NOT_FOUND');

  const [deletedUser] = await db.delete(users).where(eq(users.email, email)).returning({
    id: users.id,
    name: users.name,
    email: users.email,
  });

  return deletedUser;
}

export async function updateUser(user: User, { name, email, password }: UpdateUser) {
  let code: string | undefined;
  let hashedCode: string | undefined;

  if (email) {
    const user = await getUserByEmail(email);

    if (user) {
      throw new BackendError('CONFLICT', {
        message: 'Email already in use',
        details: { email },
      });
    }

    code = crypto.randomBytes(32).toString('hex');
    hashedCode = sha256.hash(code);
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      name,
      password,
      email,
      code: hashedCode,
      isVerified: hashedCode ? false : user.isVerified,
    })
    .where(eq(users.email, user.email))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      isAdmin: users.isAdmin,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    });

  if (!updatedUser) {
    throw new BackendError('USER_NOT_FOUND', {
      message: 'User could not be updated',
    });
  }

  if (email && code) {
    const { API_BASE_URL } = process.env;
    const status = await sendVerificationEmail(
      API_BASE_URL,
      updatedUser.name,
      updatedUser.email,
      code,
    );

    if (status !== 200) {
      await db
        .update(users)
        .set({ email: user.email, isVerified: user.isVerified })
        .where(eq(users.email, updatedUser.email))
        .returning();
      throw new BackendError('BAD_REQUEST', {
        message: 'Email could not be updated',
      });
    }
  }

  return updatedUser;
}

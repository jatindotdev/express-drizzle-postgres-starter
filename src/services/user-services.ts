import { UpdateUserSchemaType, users, type NewUser, type User } from '@/schema/user';
import { VerificationEmail } from '@/templates/verification-email';
import { API_BASE_URL, FROM_EMAIL, FROM_NAME } from '@/utils/config';
import { db } from '@/utils/db';
import { getEmailClient } from '@/utils/email';
import { BackendError } from '@/utils/errors';
import { sha256 } from '@/utils/hash';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { render } from '@react-email/render';
import argon2 from 'argon2';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

export const getUserByUserId = async (userId: string): Promise<User | null> => {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
};

export const addUser = async (user: NewUser) => {
  const { password, ...userDetails } = user;

  const salt = crypto.randomBytes(32);
  const code = crypto.randomBytes(32).toString('hex');
  const hashedCode = sha256.hash(code);
  const hashedPassword = await argon2.hash(password, {
    salt,
  });

  const [newUser] = await db
    .insert(users)
    .values({
      ...userDetails,
      password: hashedPassword,
      code: hashedCode,
      salt: salt.toString('hex'),
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      code: users.code,
      isVerified: users.isVerified,
      isAdmin: users.isAdmin,
    });

  return { user: newUser, code };
};

export const verifyUser = async (email: string, code: string): Promise<boolean> => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user) {
    throw new BackendError('User not found', 404);
  }

  if (user.isVerified) {
    throw new BackendError('User already verified', 409);
  }

  const isVerified = sha256.verify(code, user.code);

  if (!isVerified) {
    throw new BackendError('Invalid verification code', 400);
  }

  const [updatedUser] = await db.update(users).set({ isVerified }).returning();

  return updatedUser.isVerified;
};

export const deleteUser = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new BackendError('User not found', 404);
  }

  const [deletedUser] = await db.delete(users).where(eq(users.email, email)).returning({
    id: users.id,
    name: users.name,
    email: users.email,
  });

  return deletedUser;
};

export const sendVerificationEmail = async (
  baseUrl: string,
  name: string,
  email: string,
  code: string
) => {
  try {
    const client = getEmailClient();

    const emailHtml = render(VerificationEmail({ baseUrl, name, email, code }));

    const params = {
      Source: `${FROM_NAME} <${FROM_EMAIL}>`,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: 'Verify your email!',
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: emailHtml,
          },
        },
      },
    };

    const command = new SendEmailCommand(params);

    const res = await client.send(command);
    return res.$metadata.httpStatusCode;
  } catch (_err) {
    return 500;
  }
};

export const updateUser = async (
  user: User,
  { name, email, password }: UpdateUserSchemaType
) => {
  let code: string | undefined;
  let hashedCode: string | undefined;

  if (email) {
    const user = await getUserByEmail(email);

    if (user) {
      throw new BackendError('Email already in use', 409);
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

  if (email && code) {
    const status = await sendVerificationEmail(
      API_BASE_URL,
      updatedUser.name,
      updatedUser.email,
      code
    );

    if (status !== 200) {
      await db
        .update(users)
        .set({ email: user.email, isVerified: user.isVerified })
        .where(eq(users.email, updatedUser.email))
        .returning();
      throw new BackendError('Your email could not be updated', 400);
    }
  }

  return updatedUser;
};

import process from 'node:process';
import { Buffer } from 'node:buffer';
import { render } from '@react-email/render';
import argon2 from 'argon2';
import {
  type User,
  deleteUserSchema,
  loginSchema,
  newUserSchema,
  updateUserSchema,
  verifyUserSchema,
} from '@/schema/user';
import {
  addUser,
  deleteUser,
  getUserByEmail,
  updateUser,
  verifyUser,
} from '@/services/user-services';
import { UserVerified } from '@/templates/user-verified';
import { createHandler } from '@/utils/create';
import { sendVerificationEmail } from '@/utils/email';
import { BackendError, getStatusFromErrorCode } from '@/utils/errors';
import generateToken from '@/utils/jwt';

export const handleUserLogin = createHandler(loginSchema, async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (!user)
    throw new BackendError('USER_NOT_FOUND');

  const matchPassword = await argon2.verify(user.password, password, {
    salt: Buffer.from(user.salt, 'hex'),
  });
  if (!matchPassword)
    throw new BackendError('INVALID_PASSWORD');

  const token = generateToken(user.id);
  res.status(200).json({ token });
});

export const handleAddUser = createHandler(newUserSchema, async (req, res) => {
  const user = req.body;

  const existingUser = await getUserByEmail(user.email);

  if (existingUser) {
    throw new BackendError('CONFLICT', {
      message: 'User already exists',
    });
  }

  const { user: addedUser, code } = await addUser(user);

  const status = await sendVerificationEmail(
    process.env.API_BASE_URL,
    addedUser.name,
    addedUser.email,
    code,
  );

  if (status !== 200) {
    await deleteUser(addedUser.email);
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to signup user',
    });
  }

  res.status(201).json(addedUser);
});

export const handleVerifyUser = createHandler(verifyUserSchema, async (req, res) => {
  try {
    const { email, code } = req.query;

    await verifyUser(email, code);
    const template = render(
      UserVerified({ status: 'verified', message: 'User verified successfully' }),
    );
    res.status(200).send(template);
  }
  catch (err) {
    if (err instanceof BackendError) {
      const template = render(
        UserVerified({
          status: 'invalid',
          message: err.message,
          error: 'Invalid Request',
        }),
      );
      res.status(getStatusFromErrorCode(err.code)).send(template);
      return;
    }
    throw err;
  }
});

export const handleDeleteUser = createHandler(deleteUserSchema, async (req, res) => {
  const { email } = req.body;

  const { user } = res.locals as { user: User };

  if (user.email !== email && !user.isAdmin) {
    throw new BackendError('UNAUTHORIZED', {
      message: 'You are not authorized to delete this user',
    });
  }

  const deletedUser = await deleteUser(email);

  res.status(200).json({
    user: deletedUser,
  });
});

export const handleGetUser = createHandler(async (_req, res) => {
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
  });
});

export const handleUpdateUser = createHandler(updateUserSchema, async (req, res) => {
  const { user } = res.locals as { user: User };

  const { name, password, email } = req.body;

  const updatedUser = await updateUser(user, { name, password, email });

  res.status(200).json({
    user: updatedUser,
  });
});

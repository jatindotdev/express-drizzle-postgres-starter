import {
  DeleteUserSchemaType,
  LoginSchemaType,
  NewUser,
  UpdateUserSchemaType,
  User,
  VerifyUserSchemaType,
} from '@/schema/user';
import {
  addUser,
  deleteUser,
  getUserByEmail,
  sendVerificationEmail,
  updateUser,
  verifyUser,
} from '@/services/user-services';
import { UserVerified } from '@/templates/user-verified';
import { API_BASE_URL } from '@/utils/config';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';
import generateToken from '@/utils/jwt';
import { render } from '@react-email/render';
import argon2 from 'argon2';

export const handleUserLogin = createHandler(async ({ req, res }) => {
  const { email, password } = req.body as LoginSchemaType;
  const user = await getUserByEmail(email);

  if (!user) {
    throw new BackendError('User not found', 404);
  }

  const matchPassword = await argon2.verify(user.password, password, {
    salt: Buffer.from(user.salt, 'hex'),
  });
  if (!matchPassword) {
    throw new BackendError('Invalid password', 401);
  }

  const token = generateToken(user.id);
  res.status(200).json({ success: true, token });
});

export const handleAddUser = createHandler(async ({ req, res }) => {
  const user = req.body as NewUser;

  const existingUser = await getUserByEmail(user.email);

  if (existingUser) {
    throw new BackendError('User already exists', 409);
  }

  const { user: addedUser, code } = await addUser(user);

  const status = await sendVerificationEmail(
    API_BASE_URL,
    addedUser.name,
    addedUser.email,
    code
  );

  if (status !== 200) {
    await deleteUser(addedUser.email);
    throw new BackendError('Failed to signup user', 500);
  }

  res.status(201).json(addedUser);
});

export const handleVerifyUser = createHandler(async ({ req, res }) => {
  try {
    const { email, code } = req.query as VerifyUserSchemaType;
    if (!code) {
      throw new BackendError('No verification code provided', 400);
    }

    await verifyUser(email, code);
    const template = render(
      UserVerified({ status: 'verified', message: 'User verified successfully' })
    );
    res.status(200).send(template);
  } catch (err) {
    if (err instanceof BackendError) {
      const template = render(
        UserVerified({
          status: 'invalid',
          message: err.message,
          error: 'Invalid Request',
        })
      );
      res.status(err.code).send(template);
      return;
    }
    throw err;
  }
});

export const handleDeleteUser = createHandler(async ({ req, res }) => {
  const { email } = req.body as DeleteUserSchemaType;

  const { user } = res.locals as { user: User };

  if (user.email !== email && !user.isAdmin) {
    throw new BackendError('Non-admin users can only delete their own account', 401);
  }

  const deletedUser = await deleteUser(email);

  res.status(200).json({
    message: 'User deleted successfully',
    success: true,
    user: deletedUser,
  });
});

export const handleGetUser = createHandler(async ({ res }) => {
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
});

export const handleUpdateUser = createHandler(async ({ req, res }) => {
  const { user } = res.locals as { user: User };

  const { name, password, email } = req.body as UpdateUserSchemaType;

  const updatedUser = await updateUser(user, { name, password, email });

  res.status(200).json({
    user: updatedUser,
    message: 'User updated successfully',
    success: true,
  });
});

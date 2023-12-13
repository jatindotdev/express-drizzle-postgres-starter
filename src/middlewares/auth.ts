import { getUserByUserId } from '@/services/user-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';
import { verifyToken } from '@/utils/jwt';

export const authenticate = (
  { verifyAdmin } = {
    verifyAdmin: false,
  }
) => {
  return createHandler(async ({ req, res, next }) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new BackendError('Authorization header not found', 401);
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new BackendError('No token found', 401);
    }

    const { userId } = verifyToken(token);

    const user = await getUserByUserId(userId);

    if (!user) {
      throw new BackendError('User not found', 404);
    }

    if (!user.isVerified) {
      throw new BackendError('User not verified', 401);
    }

    if (verifyAdmin && !user.isAdmin) {
      throw new BackendError('User not admin', 401);
    }

    res.locals.user = user;

    next();
  });
};

import JWT from 'jsonwebtoken';
import { BackendError } from './errors';

const JWT_CONFIG: JWT.SignOptions = {
  expiresIn: '10m',
};

const { JWT_SECRET } = process.env;

export default function generateToken(userId: string): string {
  return JWT.sign({ userId }, JWT_SECRET, JWT_CONFIG);
}

export function verifyToken(token: string) {
  try {
    const data = JWT.verify(token, JWT_SECRET);

    return data as { userId: string };
  } catch (err) {
    if (err instanceof JWT.TokenExpiredError) {
      throw new BackendError('Token expired', 401);
    }

    throw new BackendError('Invalid token', 401);
  }
}

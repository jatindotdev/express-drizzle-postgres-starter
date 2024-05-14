import crypto from 'node:crypto';

export const sha256 = {
  hash: (code: string) => crypto.createHash('sha256').update(code).digest('hex'),
  verify: (code: string, hashedCode: string) =>
    crypto.createHash('sha256').update(code).digest('hex') === hashedCode,
};

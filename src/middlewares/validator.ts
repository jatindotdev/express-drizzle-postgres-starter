import { createHandler } from '@/utils/create';
import { z } from 'zod';

type RequestLocation = 'body' | 'params' | 'query';

export const validateRequest = (location: RequestLocation, schema: z.AnyZodObject) => {
  return createHandler(async ({ req, next }) => {
    let data: z.infer<typeof schema>;
    switch (location) {
      case 'body':
        data = req.body;
        break;
      case 'params':
        data = req.params;
        break;
      case 'query':
        data = req.query;
        break;
    }

    req[location] = await schema.parseAsync(data);
    next();
  });
};

import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { handleValidationError } from "../utils/errors";

type RequestLocation = "body" | "params" | "query";

export const validateRequest = (location: RequestLocation, schema: z.AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let data: z.infer<typeof schema>;
    switch (location) {
      case "body":
        data = req.body;
        break;
      case "params":
        data = req.params;
        break;
      case "query":
        data = req.query;
        break;
    }

    try {
      req[location] = await schema.parseAsync(data);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const error = handleValidationError(err);
        res.status(400).json({ error });
      } else {
        res.status(500).json({
          error: "Something went wrong",
        });
      }
    }
  };
};

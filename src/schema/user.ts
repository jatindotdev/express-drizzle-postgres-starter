import { InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").notNull().default(false),
  password: text("password").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  code: text("code").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const selectUserSchema = createSelectSchema(users, {
  email: schema => schema.email.email().regex(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/i),
});
export const verifyUserSchema = selectUserSchema.pick({ email: true, code: true });
export const deleteUserSchema = selectUserSchema.pick({ email: true });
export const loginSchema = selectUserSchema.pick({ email: true, password: true });
export const addUserSchema = selectUserSchema.pick({ name: true, email: true, password: true });
export const updateUserSchema = selectUserSchema.pick({ name: true, password: true, email: true });

export type User = InferSelectModel<typeof users>;
export type NewUser = Pick<User, "name" | "email" | "password">;

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type VerifyUserSchemaType = z.infer<typeof verifyUserSchema>;
export type DeleteUserSchemaType = z.infer<typeof deleteUserSchema>;
export type UpdateUserSchemaType = Partial<z.infer<typeof updateUserSchema>>;

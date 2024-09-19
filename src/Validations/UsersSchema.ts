import { z } from "zod";

export const createUser = z.object({
  name: z.string(),
  primaryKey: z.string(),
  password: z.string(),
  customArgs: z.any().optional(),
});

export const loginUser = z.object({
  primaryKey: z.string(),
  password: z.string(),
});

export const updateUser = z.object({
  name: z.string().optional(),
  primaryKey: z.string().optional(),
  customArgs: z.any().optional(),
});

export const verifyUser = z.object({
  userId: z.string(),
  code: z.string(),
});

export const resendUser = z.object({
  primaryKey: z.string(),
});

export const forgetPasswordUser = z.object({
  primaryKey: z.string(),
});

export const forgetPasswordVerifyUser = z.object({
  primaryKey: z.string(),
  code: z.string(),
  password: z.string()
});


export const revokeUser = z.object({
  refreshToken: z.string(),
});
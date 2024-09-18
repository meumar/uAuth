import { z } from "zod";
import { invalidEmail } from "../Messages/ErrorExceptions";

export const createClient = z.object({
  name: z.string(),
  email: z.string().email(invalidEmail),
  logo: z.string().optional(),
});

export const loginClient = z.object({
  email: z.string().email(invalidEmail),
  password: z.string(),
});

export const verifyClient = z.object({
  source: z.string(),
  userId: z.string(),
  code: z.string(),
});

export const resendClient = z.object({
  email: z.string().email(invalidEmail),
});

export const revoke = z.object({
  refreshToken: z.string(),
});

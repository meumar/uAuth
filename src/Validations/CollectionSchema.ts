import { z } from "zod";
import { invalidUrl } from "../Messages/ErrorExceptions";

export const createCollection = z.object({
  name: z.string(),
  callbackUrl: z.string().url(invalidUrl),
  verificationToken: z.string(),
  accessTokenLifetime: z.number().optional(),
  refreshTokenLifetime: z.number().optional(),
  secretToken: z.string()
});

export const updateCollection = z.object({
  name: z.string().optional(),
  callbackUrl: z.string().url(invalidUrl).optional(),
  verificationToken: z.string().optional(),
  accessTokenLifetime: z.number().optional(),
  refreshTokenLifetime: z.number().optional(),
  secretToken: z.string().optional()
});
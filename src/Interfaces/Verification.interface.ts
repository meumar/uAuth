import { Document } from "mongoose";

export default interface Verification extends Document {
  verificationType: string;
  phone?: string;
  email?: string;
  code: string;
  userId: any;
  expiresAt: string;
}

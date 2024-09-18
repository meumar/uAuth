import { Document } from "mongoose";

export default interface User extends Document {
  name: string;
  clientId: string;
  callbackUrl: string;
  status: string;
  password: string

  isValidPassword(password: string): Promise<Error | boolean>;
}

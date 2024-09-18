import { Document } from "mongoose";

export default interface Client extends Document {
  name: string;
  email: string;
  logo: string;
  password: string;
  status: string;

  isValidPassword(password: string): Promise<Error | boolean>;
}

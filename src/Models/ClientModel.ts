import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

import Client from "../Interfaces/Client.interface";

const ClientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true, 
      unique: true,
      trim: true,
      index: true,
    },
    logo: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ACTIVE", "INACTIVE"],
      default: "INACTIVE",
      index: true,
    },
  },
  { timestamps: true }
);

ClientSchema.pre<Client>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;

  next();
});

ClientSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

export default model<Client>("Client", ClientSchema);

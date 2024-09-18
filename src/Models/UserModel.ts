import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

import User from "../Interfaces/User.interface";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    collectionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Collection",
      index: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Collection",
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ACTIVE", "INACTIVE"],
      default: "INACTIVE",
      index: true,
    },
    primaryKey: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    customArgs: {
      type: Schema.Types.Mixed,
      index: true,
    },
  },
  { timestamps: true }
);


UserSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

export default model<User>("User", UserSchema);

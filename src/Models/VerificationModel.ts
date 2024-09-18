import { Schema, model } from "mongoose";
import Verification from "../Interfaces/Verification.interface";

const VerificationSchema = new Schema(
  {
    verificationType: {
      type: String,
      required: true,
      index: true,
      enum: ["CLIENT", "USER"],
    },
    phone: {
      type: String,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);
export default model<Verification>("Verification", VerificationSchema);

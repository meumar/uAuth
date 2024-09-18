import { Schema, model } from "mongoose";

import Collection from "../Interfaces/Collection.interface";

const CollectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    callbackUrl: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    verificationToken: {
      type: String,
      required: true,
      trim: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Collection",
      index: true,
    },
    secretToken: {
      type: String,
      required: true,
    },
    accessTokenLifetime: {
      type: Number,
      default: 60,
    },
    refreshTokenLifetime: {
      type: Number,
      default: 1440,
    },
    authKey: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      index: true,
    },
  },
  { timestamps: true }
);

export default model<Collection>("Collection", CollectionSchema);

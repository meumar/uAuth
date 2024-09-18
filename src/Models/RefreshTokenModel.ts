import { Schema, model } from "mongoose";
interface RefreshToken {
  clientId: string;
  expiresAt: string,
  refreshToken: string
}
const RefreshTokenSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Client",
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true, 
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);
export default model<RefreshToken>("RefreshToken", RefreshTokenSchema);

import VerificationModel from "../../Models/VerificationModel";
import { CustomError } from "../../Exceptions/customError";
import Verification from "../../Interfaces/Verification.interface";
import mongoose from "mongoose";
const verification = VerificationModel;

const ObjectId = mongoose.Types.ObjectId;

export const createNewCode = async (
  payload: any,
  createNew: boolean
): Promise<any | CustomError> => {
  try {
    if (!createNew) {
      await verification.deleteMany({
        userId: payload.userId,
        verificationType: payload.verificationType,
      });
    }
    return verification.create(payload);
  } catch (error: any) {
    throw error;
  }
};

export const verifyClientCode = async (
  payload: any
): Promise<any | CustomError> => {
  try {
    return verification.findOne({
      userId: new ObjectId(payload.userId),
      verificationType: payload.source,
      code: payload.code,
      expiresAt: {
        $gte: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    throw error;
  }
};

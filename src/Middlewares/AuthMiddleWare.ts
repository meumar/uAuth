import { Context, Next } from "hono";
import {
  CustomError,
  Error401Exception,
  Error403Exception,
} from "../Exceptions/customError";
import { verifyAuthToken } from "../Utils/Token";
import {
  deletedMany,
  getOneByQuery,
} from "../Services/DatabaseServices/CommonDBServices";
import { notAllowedCreate } from "../Messages/ErrorExceptions";
import mongoose from "mongoose";
import { getContext } from "hono/context-storage";

const ObjectId = mongoose.Types.ObjectId;

export const verifyClientToken = async (c: Context, next: Next) => {
  try {
    const authToken = c.req.header("Authorization");
    if (!authToken) throw new Error401Exception();
    const decodedPayload = await verifyAuthToken(authToken, "AUTH_TOKEN");
    c.set("client", decodedPayload);
    await next();
  } catch (e: any) {
    throw new Error401Exception(e?.message);
  }
};

export const verifyUserToken = async (c: Context, next: Next) => {
  try {
    const { authToken } = await c.req.json();
    if (!authToken) throw new Error401Exception();

    const collection = getContext<RequestInterface>().var.collection;

    const decodedPayload = await verifyAuthToken(
      authToken,
      "AUTH_TOKEN",
      collection.secretToken
    );
    c.set("user", decodedPayload);
    await next();
  } catch (e: any) {
    throw new Error401Exception(e?.message);
  }
};

export const verifyCollectionToken = async (c: Context, next: Next) => {
  try {
    const authToken = c.req.header("Authorization");
    if (!authToken) throw new Error401Exception();

    const collectionId = c.req.param("collectionId");
    const collection = await getOneByQuery(
      { _id: new ObjectId(collectionId), authKey: authToken },
      "COLLECTION"
    );
    if (!collection) throw new Error403Exception(notAllowedCreate);
    c.set("collection", collection);
    await next();
  } catch (e: any) {
    throw new CustomError(e?.message, e.statusCode);
  }
};

export const verifyRefreshToken = async (authTokenData: any, sToken: string = "") => {
  try {
    return await verifyAuthToken(authTokenData.refreshToken, "REFRESH_TOKEN", sToken);
  } catch (e: any) {
    deletedMany({ _id: authTokenData._id }, "REFRESHTOKEN");
    throw new Error401Exception(e?.message);
  }
};

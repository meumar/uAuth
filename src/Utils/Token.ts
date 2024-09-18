import { decode, sign, verify } from "hono/jwt";
import Client from "../Interfaces/Client.interface";
import {
  client_jwt_auth_secret,
  client_jwt_auth_lite_time,
  client_jwt_refresh_secret,
  client_jwt_refresh_lite_time,
} from "./Config";
import {
  create,
  deletedMany,
} from "../Services/DatabaseServices/CommonDBServices";

export const createAuthToken = async (
  payload: any,
  type: string,
  sToken = "",
  eNumber = 0
) => {
  let secret = sToken
    ? sToken
    : type == "AUTH_TOKEN"
    ? client_jwt_auth_secret
    : client_jwt_refresh_secret;
  let lifetime = eNumber
    ? eNumber
    : type == "AUTH_TOKEN"
    ? client_jwt_auth_lite_time
    : client_jwt_refresh_lite_time;

  const expired = Math.floor(Date.now() / 1000) + 60 * lifetime;

  const token = await sign(
    {
      ...payload,
      exp: expired,
      iat: Math.floor(Date.now() / 1000),
    },
    secret
  );

  //Save refresh token and delete expired ones
  if (type == "REFRESH_TOKEN") {
    await Promise.all([
      create(
        {
          clientId: payload._id,
          expiresAt: expired,
          refreshToken: token,
        },
        "REFRESHTOKEN"
      ),
      deletedMany(
        {
          clientId: payload._id,
          expiresAt: {
            $lt: Math.floor(Date.now() / 1000),
          },
        },
        "REFRESHTOKEN"
      ),
    ]);
  }

  return token;
};

export const verifyAuthToken = async (
  token: string,
  type: string,
  sToken: string = ""
) => {
  let secret = sToken
    ? sToken
    : type == "AUTH_TOKEN"
    ? client_jwt_auth_secret
    : client_jwt_refresh_secret;
  return verify(token, secret);
};

export const createClientAuthData = (client: Client) => {
  return {
    _id: client._id,
    name: client.name,
    email: client.email,
    status: client.status,
  };
};

export const generateOTP = () => {
  const characters: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }
  return otp;
};

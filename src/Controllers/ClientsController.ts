import { Context } from "hono";
import ClientService from "../Services/DatabaseServices/ClientDBServices";
import { sendVerificationCode } from "../Utils/Verification";
import { verifyClientCode } from "../Services/DatabaseServices/VerificationDBServices";
import {
  Error400Exception,
  Error401Exception,
  Error409Exception,
} from "../Exceptions/customError";
import {
  deletedMany,
  getOneByQuery,
  updateOne,
} from "../Services/DatabaseServices/CommonDBServices";
import {
  accessTokenGeneratedSucess,
  verificationSendSuccess,
  RESEND_MESSAGE,
  SIGN_UP_MESSAGE,
  clientRegisteredSuccess,
} from "../Messages/Messages";
import {
  invalidRefreshToken,
  invalidVerification,
  userAlreadyVerified,
  userNotFound,
} from "../Messages/ErrorExceptions";
import { verifyRefreshToken } from "../Middlewares/AuthMiddleWare";
import { createAuthToken } from "../Utils/Token";

const clientService = new ClientService();

export const createClients = async (c: Context) => {
  try {
    const form = await c.req.json();
    const { _id, name, email, createdAt, updatedAt } =
      await clientService.register(form);

    await sendVerificationCode(
      { _id, name, email, createdAt, updatedAt },
      true,
      SIGN_UP_MESSAGE
    );
    return c.json({
      success: true,
      data: { _id, name, email, createdAt, updatedAt },
      messages: clientRegisteredSuccess
    });
  } catch (e) {
    throw e;
  }
};

export const login = async (c: Context) => {
  try {
    const form = await c.req.json();
    const authDetails = await clientService.login(form.email, form.password);
    return c.json(authDetails);
  } catch (e) {
    throw e;
  }
};

export const verify = async (c: Context) => {
  try {
    const form = await c.req.json();
    const code = await verifyClientCode(form);
    if (!code) throw new Error400Exception(invalidVerification, form, false);
    await Promise.all([
      updateOne({ _id: form.userId }, { status: "ACTIVE" }, "CLIENT"),
      deletedMany(
        {
          userId: form.userId,
          verificationType: "CLIENT",
          code: form.code,
        },
        "VERIFICATION"
      ),
    ]);
    return c.json({
      success: true,
      mesaage: "Client verified succefully",
    });
  } catch (e) {
    throw e;
  }
};

export const resend = async (c: Context) => {
  try {
    const form = await c.req.json();
    const client = await getOneByQuery(form, "CLIENT");

    if (!client) throw new Error400Exception(userNotFound, form, false);
    if (client.status == "ACTIVE")
      throw new Error409Exception(userAlreadyVerified, form, false);

    await deletedMany(
      {
        userId: client.clientId,
        verificationType: client.source,
      },
      "VERIFICATION"
    );
    await sendVerificationCode(client, true, RESEND_MESSAGE);

    return c.json({
      success: true,
      mesaage: verificationSendSuccess,
    });
  } catch (e) {
    throw e;
  }
};

export const revokeToken = async (c: Context) => {
  try {
    const form = await c.req.json();
    const refreshTokenData = await getOneByQuery(form, "REFRESHTOKEN");

    if (!refreshTokenData)
      throw new Error401Exception(invalidRefreshToken, form, false);
    const { _id, name, email, status } = await verifyRefreshToken(
      refreshTokenData
    );
    const payload = { _id, name, email, status };
    const access_token = await createAuthToken(payload, "AUTH_TOKEN");
    return c.json({
      success: true,
      mesaage: accessTokenGeneratedSucess,
      data: {
        authToken: access_token,
      },
    });
  } catch (e) {
    throw e;
  }
};


export const forgetPassword = async (c: Context) => {
  try {
    const form = await c.req.json();
    const client = await getOneByQuery(form, "CLIENT");

    if (!client) throw new Error400Exception(userNotFound, form, false);
    if (client.status == "ACTIVE")
      throw new Error409Exception(userAlreadyVerified, form, false);

    await deletedMany(
      {
        userId: client.clientId,
        verificationType: client.source,
      },
      "VERIFICATION"
    );
    await sendVerificationCode(client, true, RESEND_MESSAGE);

    return c.json({
      success: true,
      mesaage: verificationSendSuccess,
    });
  } catch (e) {
    throw e;
  }
};

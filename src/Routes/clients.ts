import { Hono } from "hono";

import { login, createClients, verify, resend, revokeToken, forgetPassword } from "../Controllers/ClientsController";
import { verifyClientToken } from "../Middlewares/AuthMiddleWare";
import { validator } from "hono/validator";
import { createClient, loginClient, resendClient, revoke, verifyClient } from "../Validations/ClientSchema";
import { Error400Exception } from "../Exceptions/customError";
import { error400Message } from "../Messages/ErrorExceptions";
import { getContext } from "hono/context-storage";
import { getById } from "../Services/DatabaseServices/CommonDBServices";

const clients = new Hono();

clients.post(
  "/",
  validator("json", (value, c) => {
    const parsed = createClient.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    try {
      return createClients(c);
    } catch (e) {
      throw e;
    }
  }
);

clients.post(
  "/login",
  validator("json", (value, c) => {
    const parsed = loginClient.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    return login(c);
  }
);


clients.get("/", verifyClientToken, async (c) => {
  const { _id } = getContext<RequestInterface>().var.client;
  return c.json({
    success: true,
    data: await getById(
      _id,
      "_id name email status createdAt updatedAt",
      "CLIENT"
    ),
  });
});


clients.post(
  "/verify",
  validator("json", (value, c) => {
    const parsed = verifyClient.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    return verify(c);
  }
);

clients.post(
  "/resend",
  validator("json", (value, c) => {
    const parsed = resendClient.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    return resend(c);
  }
);


clients.post(
  "/revoke-token",
  validator("json", (value, c) => {
    const parsed = revoke.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    return revokeToken(c);
  }
);

clients.post(
  "/forget-password",
  validator("json", (value, c) => {
    const parsed = resendClient.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    return forgetPassword(c);
  }
);


export default clients;

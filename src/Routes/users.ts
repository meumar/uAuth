import { Hono } from "hono";
import { CustomError, Error400Exception } from "../Exceptions/customError";
import { validator } from "hono/validator";
import {
  createUser,
  forgetPasswordUser,
  forgetPasswordVerifyUser,
  loginUser,
  resendUser,
  revokeUser,
  updateUser,
  verifyUser,
} from "../Validations/UsersSchema";
import { error400Message, reqSizeExeceeded } from "../Messages/ErrorExceptions";
import {
  authenticateUser,
  checkUser,
  createUsers,
  deleteUser,
  fetchUsers,
  fetchUsersByCustomsrgs,
  forgetPasswordUsers,
  forgetPasswordVerifyUsers,
  getUser,
  getUserByPrimarykey,
  loginUsers,
  resendUsers,
  revokeToken,
  updateUsers,
  verifyUsers,
} from "../Controllers/UsersController";
import {
  verifyCollectionToken,
  verifyUserToken,
} from "../Middlewares/AuthMiddleWare";
import { bodyLimit } from "hono/body-limit";
import { BODY_SIZE } from "../Utils/Config";
const users = new Hono();

users.post(
  "/register/:collectionId",
  verifyCollectionToken,
  validator("json", (value, c) => {
    const parsed = createUser.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  bodyLimit({
    maxSize: BODY_SIZE,
    onError: (c) => {
      throw new CustomError(reqSizeExeceeded, 413);
    },
  }),
  (c) => {
    try {
      return createUsers(c);
    } catch (e) {
      throw e;
    }
  }
);

users.post(
  "/verify/:collectionId",
  verifyCollectionToken,
  validator("json", (value, c) => {
    const parsed = verifyUser.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    try {
      return verifyUsers(c);
    } catch (e) {
      throw e;
    }
  }
);

users.post(
  "/resend/:collectionId",
  verifyCollectionToken,
  validator("json", (value, c) => {
    const parsed = resendUser.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    try {
      return resendUsers(c);
    } catch (e) {
      throw e;
    }
  }
);

users.post(
  "/login/:collectionId",
  verifyCollectionToken,
  validator("json", (value, c) => {
    const parsed = loginUser.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    return loginUsers(c);
  }
);

users.post(
  "/revoke-token/:collectionId",
  verifyCollectionToken,
  validator("json", (value, c) => {
    const parsed = revokeUser.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    return revokeToken(c);
  }
);

users.get("/details/:collectionId", verifyCollectionToken, (c) => {
  return fetchUsers(c);
});

users.post("/details/:collectionId", verifyCollectionToken, (c) => {
  return fetchUsersByCustomsrgs(c);
});

users.post("/details/:collectionId/:id", verifyCollectionToken, (c) => {
  return checkUser(c);
});

users.get("/details/:collectionId/:id", verifyCollectionToken, (c) => {
  return getUser(c);
});

users.get(
  "/details-userkey/:collectionId/:userkey",
  verifyCollectionToken,
  (c) => {
    return getUserByPrimarykey(c);
  }
);

users.patch(
  "/details/:collectionId/:id",
  verifyCollectionToken,
  validator("json", (value, c) => {
    const parsed = updateUser.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    return updateUsers(c);
  }
);

users.delete("/details/:collectionId/:id", verifyCollectionToken, (c) => {
  try {
    return deleteUser(c);
  } catch (e) {
    throw e;
  }
});

users.post(
  "/authenticate/:collectionId",
  verifyCollectionToken,
  verifyUserToken,
  (c) => {
    try {
      return authenticateUser(c);
    } catch (e) {
      throw e;
    }
  }
);

users.post(
  "/forget-password/:collectionId",
  verifyCollectionToken,
  validator("json", (value, c) => {
    const parsed = forgetPasswordUser.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    try {
      return forgetPasswordUsers(c);
    } catch (e) {
      throw e;
    }
  }
);

users.post(
  "/forget-password-verify/:collectionId",
  verifyCollectionToken,
  validator("json", (value, c) => {
    const parsed = forgetPasswordVerifyUser.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    try {
      return forgetPasswordVerifyUsers(c);
    } catch (e) {
      throw e;
    }
  }
);

export default users;

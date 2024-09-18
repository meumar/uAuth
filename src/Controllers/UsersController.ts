import { Context } from "hono";
import bcrypt from "bcrypt";
import {
  authenticateSuccess,
  createdSuccess,
  deletedSuccess,
  fetchedSuccess,
  updateddSuccess,
  verificationSendSuccess,
  verifiedSuccess,
} from "../Messages/Messages";
import {
  create,
  deletedMany,
  deleteOne,
  findAndUpdate,
  findOneByQuery,
  getById,
  getByPagination,
  getOneByQuery,
  updateOne,
} from "../Services/DatabaseServices/CommonDBServices";
import { getContext } from "hono/context-storage";
import { sendUserVerificationCode } from "../Utils/Verification";
import {
  Error400Exception,
  Error403Exception,
  Error409Exception,
} from "../Exceptions/customError";
import {
  duplicateCollection,
  duplicateUser,
  invalidVerification,
  notAllowedCreate,
  notAllowedUpdate,
  userAlreadyVerified,
  userNotFound,
} from "../Messages/ErrorExceptions";
import UserService from "../Services/DatabaseServices/UserDBServices";
import { verifyAuthToken } from "../Utils/Token";
import { verifyClientCode } from "../Services/DatabaseServices/VerificationDBServices";

const clientService = new UserService();

export const createUsers = async (c: Context) => {
  try {
    const form = await c.req.json();
    const collection = getContext<RequestInterface>().var.collection;
    const collectionId = c.req.param("collectionId");

    if (!collection) throw new Error403Exception(notAllowedCreate, form, false);

    const { _id, name, primaryKey, clientId, customArgs } = await create(
      {
        ...form,
        status: "INACTIVE",
        collectionId: collectionId,
        clientId: collection.clientId,
      },
      "USER"
    );

    await sendUserVerificationCode(
      { _id, name, collectionId, clientId, primaryKey, customArgs },
      collection,
      true,
      "REGISTRATION"
    );

    return c.json({
      success: true,
      data: { _id, name, collectionId, clientId, primaryKey, customArgs },
      messages: createdSuccess,
    });
  } catch (e) {
    throw e;
  }
};

export const verifyUsers = async (c: Context) => {
  try {
    const form = await c.req.json();
    const code = await verifyClientCode({
      ...form,
      source: "USER",
    });
    if (!code) throw new Error400Exception(invalidVerification, form, false);

    await Promise.all([
      updateOne({ _id: form.userId }, { status: "ACTIVE" }, "USER"),
      deletedMany(
        {
          userId: form.userId,
          verificationType: "USER",
        },
        "VERIFICATION"
      ),
    ]);
    return c.json({
      success: true,
      mesaage: "User verified succefully",
    });
  } catch (e) {
    throw e;
  }
};

export const resendUsers = async (c: Context) => {
  try {
    const form = await c.req.json();
    const collectionId = c.req.param("collectionId");

    const user = await getOneByQuery({ primaryKey: form.primaryKey, collectionId: collectionId }, "USER");
    const collection = getContext<RequestInterface>().var.collection;

    if (!user) throw new Error400Exception(userNotFound, form, false);
    if (user.status == "ACTIVE")
      throw new Error409Exception(userAlreadyVerified, form, false);

    await deletedMany(
      {
        userId: user._id,
        verificationType: "USER",
      },
      "VERIFICATION"
    );
    await sendUserVerificationCode(user, collection, true, "VERIFICATION");

    return c.json({
      success: true,
      mesaage: verificationSendSuccess,
    });
  } catch (e) {
    throw e;
  }
};

export const loginUsers = async (c: Context) => {
  try {
    const form = await c.req.json();
    const collection = getContext<RequestInterface>().var.collection;
    const authDetails = await clientService.login(
      form.primaryKey,
      form.password,
      collection
    );
    return c.json(authDetails);
  } catch (e) {
    throw e;
  }
};

export const fetchUsers = async (c: Context) => {
  try {
    const collection = getContext<RequestInterface>().var.collection;
    const {
      limit = 10,
      page = 1,
      search = "",
      sortBy = "_id",
      sortOrder = "desc",
    } = c.req.query();
    let query: any = { collectionId: collection._id };
    if (search) {
      query["name"] = {
        $regex: new RegExp(search, "i"),
      };
    }
    const data = await getByPagination(
      query,
      Number(limit),
      Number(page),
      { [sortBy]: sortOrder == "asc" ? 1 : -1 },
      "_id name primaryKey customArgs createdAt, updatedAt",
      "USER"
    );

    return c.json({
      success: true,
      data: data,
      messages: fetchedSuccess,
    });
  } catch (e) {
    throw e;
  }
};

export const getUser = async (c: Context) => {
  try {
    const collection = getContext<RequestInterface>().var.collection;
    const userId = c.req.param("id");
    const user = await findOneByQuery(
      { _id: userId, collectionId: collection._id },
      "_id name primaryKey customArgs createdAt, updatedAt",
      "USER"
    );
    return c.json({
      success: true,
      data: user,
      messages: fetchedSuccess,
    });
  } catch (e) {
    throw e;
  }
};
export const getUserByPrimarykey = async (c: Context) => {
  try {
    const collection = getContext<RequestInterface>().var.collection;
    const userkey = c.req.param("userkey");
    const user = await findOneByQuery(
      { primaryKey: userkey, collectionId: collection._id },
      "_id name primaryKey customArgs createdAt, updatedAt",
      "USER"
    );
    return c.json({
      success: true,
      data: user,
      messages: fetchedSuccess,
    });
  } catch (e) {
    throw e;
  }
};

export const updateUsers = async (c: Context) => {
  try {
    const { name, primaryKey, customArgs } = await c.req.json();
    const form = {
      name,
      primaryKey,
      customArgs,
    };
    const collection = getContext<RequestInterface>().var.collection;
    const userId = c.req.param("id");
    const exists = await findOneByQuery(
      { _id: userId, collectionId: collection._id },
      "_id customArgs",
      "USER"
    );
    if (!exists) throw new Error403Exception(notAllowedUpdate, form, true);

    if (form.primaryKey) {
      const duplicateName = await findOneByQuery(
        {
          collectionId: collection._id,
          primaryKey: {
            $regex: new RegExp(form.primaryKey, "i"),
          },
          _id: { $ne: userId },
        },
        "_id",
        "USER"
      );
      if (duplicateName?._id) {
        throw new Error409Exception(duplicateUser, form, false);
      }
    }

    await findAndUpdate({ _id: userId }, form, "USER");
    return c.json({
      success: true,
      messages: updateddSuccess,
    });
  } catch (e) {
    throw e;
  }
};

export const deleteUser = async (c: Context) => {
  try {
    const collection = getContext<RequestInterface>().var.collection;
    const userId = c.req.param("id");

    await deleteOne({ _id: userId, collectionId: collection._id }, "USER");
    return c.json({
      success: true,
      messages: deletedSuccess,
    });
  } catch (e) {
    throw e;
  }
};

export const authenticateUser = async (c: Context) => {
  try {
    const user = getContext<RequestInterface>().var.user;
    return c.json({
      success: true,
      messages: authenticateSuccess,
      data: user,
    });
  } catch (e) {
    throw e;
  }
};

export const forgetPasswordUsers = async (c: Context) => {
  try {
    const form = await c.req.json();
    const collectionId = c.req.param("collectionId");
    const user = await getOneByQuery(
      { primaryKey: form.primaryKey, collectionId: collectionId },
      "USER"
    );
    const collection = getContext<RequestInterface>().var.collection;

    if (!user) throw new Error400Exception(userNotFound, form, false);

    await deletedMany(
      {
        userId: user._id,
        verificationType: "USER",
      },
      "VERIFICATION"
    );
    await sendUserVerificationCode(user, collection, true, "FORGET_PASSWORD");

    return c.json({
      success: true,
      mesaage: verificationSendSuccess,
    });
  } catch (e) {
    throw e;
  }
};

export const forgetPasswordVerifyUsers = async (c: Context) => {
  try {
    const form = await c.req.json();
    const collectionId = c.req.param("collectionId");

    const user = await getOneByQuery(
      { primaryKey: form.primaryKey, collectionId: collectionId },
      "USER"
    );
    if (!user) throw new Error400Exception(userNotFound, form, false);

    const code = await verifyClientCode({
      userId: user._id,
      code: form.code,
      source: "USER",
    });
    if (!code) throw new Error400Exception(invalidVerification, form, false);
    const hash = await bcrypt.hash(form.password, 10);
    await Promise.all([
      updateOne({ _id: user._id }, { password: hash }, "USER"),
      deletedMany(
        {
          userId: user._id,
          verificationType: "USER",
        },
        "VERIFICATION"
      ),
    ]);
    return c.json({
      success: true,
      mesaage: verifiedSuccess
    });
  } catch (e) {
    throw e;
  }
};

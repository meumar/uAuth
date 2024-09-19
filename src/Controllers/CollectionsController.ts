import { Context } from "hono";
import {
  create,
  deleteOne,
  findAndUpdate,
  findOneByQuery,
  getByPagination,
} from "../Services/DatabaseServices/CommonDBServices";
import {
  createdSuccess,
  deletedSuccess,
  fetchedSuccess,
  updateddSuccess,
} from "../Messages/Messages";
import { getContext } from "hono/context-storage";
import {
  Error403Exception,
  Error409Exception,
} from "../Exceptions/customError";
import {
  authTokenValueError,
  duplicateCollection,
  duplicateUser,
  notAllowedUpdate,
} from "../Messages/ErrorExceptions";
import { randomUUID } from "crypto";

export const createCollections = async (c: Context) => {
  try {
    const form = await c.req.json();
    const client = getContext<RequestInterface>().var.client;

    if (form.accessTokenLifetime >= form.refreshTokenLifetime) {
      throw new Error409Exception(authTokenValueError, form, false);
    }

    const existedClient = await findOneByQuery(
      {
        clientId: client._id,
        name: {
          $regex: new RegExp(form.name, "i"),
        },
      },
      "_id",
      "COLLECTION"
    );

    if (existedClient?._id) {
      throw new Error409Exception(duplicateCollection, form, false);
    }

    const {
      _id,
      name,
      callbackUrl,
      clientId,
      authKey,
      status,
      createdAt,
      updatedAt,
    } = await create(
      {
        ...form,
        clientId: client._id,
        status: "ACTIVE",
        authKey: randomUUID(),
      },
      "COLLECTION"
    );

    return c.json({
      success: true,
      data: {
        _id,
        name,
        callbackUrl,
        authKey,
        clientId,
        status,
        createdAt,
        updatedAt,
      },
      messages: createdSuccess,
    });
  } catch (e) {
    throw e;
  }
};

export const updateCollections = async (c: Context) => {
  try {
    const {
      name,
      callbackUrl,
      verificationToken,
      accessTokenLifetime,
      refreshTokenLifetime,
      secretToken,
    } = await c.req.json();
    const form = {
      name,
      callbackUrl,
      verificationToken,
      accessTokenLifetime,
      refreshTokenLifetime,
      secretToken,
    };
    const client = getContext<RequestInterface>().var.client;
    const collectionId = c.req.param("id");
    const exists = await findOneByQuery(
      { _id: collectionId, clientId: client._id },
      "_id",
      "COLLECTION"
    );
    if (!exists) throw new Error403Exception(notAllowedUpdate, form, true);

    if (form.name) {
      const duplicateName = await findOneByQuery(
        {
          clientId: client._id,
          name: {
            $regex: new RegExp(form.name, "i"),
          },
          _id: { $ne: collectionId },
        },
        "_id",
        "COLLECTION"
      );
      if (duplicateName?._id) {
        throw new Error409Exception(duplicateCollection, form, false);
      }
    }

    await findAndUpdate({ _id: collectionId }, form, "COLLECTION");
    return c.json({
      success: true,
      messages: updateddSuccess,
    });
  } catch (e) {
    throw e;
  }
};

export const getCollection = async (c: Context) => {
  try {
    const client = getContext<RequestInterface>().var.client;
    const collectionId = c.req.param("id");
    const collection = await findOneByQuery(
      { _id: collectionId, clientId: client._id },
      "_id name callbackUrl clientId status accessTokenLifetime refreshTokenLifetime createdAt updatedAt",
      "COLLECTION"
    );
    return c.json({
      success: true,
      data: collection,
      messages: fetchedSuccess,
    });
  } catch (e) {
    throw e;
  }
};

export const deleteCollection = async (c: Context) => {
  try {
    const client = getContext<RequestInterface>().var.client;
    const collectionId = c.req.param("id");
    await deleteOne({ _id: collectionId, clientId: client._id }, "COLLECTION");
    return c.json({
      success: true,
      messages: deletedSuccess,
    });
  } catch (e) {
    throw e;
  }
};

export const getCollections = async (c: Context) => {
  try {
    const client = getContext<RequestInterface>().var.client;
    const {
      limit = 10,
      page = 1,
      search = "",
      sortBy = "_id",
      sortOrder = "desc",
    } = c.req.query();
    let query: any = { clientId: client._id };
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
      "_id name callbackUrl clientId status accessTokenLifetime refreshTokenLifetime createdAt, updatedAt",
      "COLLECTION"
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

export const fetchCollectionUsers = async (c: Context) => {
  try {
    const client = getContext<RequestInterface>().var.client;
    const collectionId = c.req.param("id");

    const {
      limit = 10,
      page = 1,
      search = "",
      sortBy = "_id",
      sortOrder = "desc",
    } = c.req.query();

    let query: any = { collectionId: collectionId, clientId: client._id };
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
export const fetchCollectionUser = async (c: Context) => {
  try {
    const client = getContext<RequestInterface>().var.client;
    const userId = c.req.param("userId");
    const collectionId = c.req.param("id");

    const user = await findOneByQuery(
      { _id: userId, collectionId: collectionId, clientId: client._id },
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
    const client = getContext<RequestInterface>().var.client;
    const userId = c.req.param("userId");
    const collectionId = c.req.param("id");

    const { name, primaryKey, customArgs } = await c.req.json();
    const form = {
      name,
      primaryKey,
      customArgs,
    };
    const exists = await findOneByQuery(
      { _id: userId, collectionId: collectionId, clientId: client._id },
      "_id customArgs",
      "USER"
    );
    if (!exists) throw new Error403Exception(notAllowedUpdate, form, true);

    if (form.primaryKey) {
      const duplicateName = await findOneByQuery(
        {
          collectionId: collectionId,
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
    const client = getContext<RequestInterface>().var.client;
    const userId = c.req.param("userId");
    const collectionId = c.req.param("id");

    await deleteOne(
      { _id: userId, collectionId: collectionId, clientId: client._id },
      "USER"
    );
    return c.json({
      success: true,
      messages: deletedSuccess,
    });
  } catch (e) {
    throw e;
  }
};

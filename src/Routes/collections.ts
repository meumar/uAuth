import { Hono } from "hono";
import { Error400Exception } from "../Exceptions/customError";
import { validator } from "hono/validator";
import {
  createCollection,
  updateCollection,
} from "../Validations/CollectionSchema";
import { error400Message } from "../Messages/ErrorExceptions";
import {
  createCollections,
  deleteCollection,
  getCollection,
  getCollections,
  updateCollections,
} from "../Controllers/CollectionsController";
import { verifyClientToken } from "../Middlewares/AuthMiddleWare";
const collections = new Hono();

collections.post(
  "/",
  verifyClientToken,
  validator("json", (value, c) => {
    const parsed = createCollection.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    try {
      return createCollections(c);
    } catch (e) {
      throw e;
    }
  }
);

collections.patch(
  "/:id",
  verifyClientToken,
  validator("json", (value, c) => {
    const parsed = updateCollection.safeParse(value);
    if (!parsed.success) {
      throw new Error400Exception(error400Message, parsed.error, false);
    }
    return parsed.data;
  }),
  (c) => {
    try {
      return updateCollections(c);
    } catch (e) {
      throw e;
    }
  }
);

collections.get("/:id", verifyClientToken, (c) => {
  try {
    return getCollection(c);
  } catch (e) {
    throw e;
  }
});


collections.delete("/:id", verifyClientToken, (c) => {
  try {
    return deleteCollection(c);
  } catch (e) {
    throw e;
  }
});


collections.get(
  "/",
  verifyClientToken,
  (c) => {
    try {
      return getCollections(c);
    } catch (e) {
      throw e;
    }
  }
);

export default collections;

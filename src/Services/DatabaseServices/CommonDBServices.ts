import ClientModel from "../../Models/ClientModel";
import VerificationModel from "../../Models/VerificationModel";
import RefreshTokenModel from "../../Models/RefreshTokenModel";
import CollectionModel from "../../Models/CollectionModel";
import UserModel from "../../Models/UserModel";

const models: any = {
  CLIENT: ClientModel,
  VERIFICATION: VerificationModel,
  REFRESHTOKEN: RefreshTokenModel,
  COLLECTION: CollectionModel,
  USER: UserModel
};

export const getByPagination = async (
  query: any,
  limit: number,
  page: number,
  sort: any = { _id: 1 },
  select: string = "_id name",
  model: string
) => {
  const skip = (page - 1) * limit;
  return models[model]
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(select);
};

export const findOneByQuery = async (
  query: any,
  select = "",
  model: string
) => {
  if (select) {
    return models[model].findOne(query).select(select).lean();
  } else {
    return models[model].findOne(query).lean();
  }
};

export const getById = (id: string, select = "", model: string) => {
  if (select) {
    return models[model].findById(id).select(select).lean();
  } else {
    return models[model].findById(id).lean();
  }
};

export const create = async (data: any, model: string) => {
  return models[model].create(data);
};

export const updateOne = (query: any, data: any, model: string) => {
  return models[model].updateOne(query, { $set: data });
};

export const deletedMany = (query: any, model: string) => {
  return models[model].deleteMany(query);
};

export const deleteOne = (query: any, model: string) => {
  return models[model].deleteOne(query);
};

export const findAndUpdate = (query: any, data: any, model: string) => {
  return models[model].findOneAndUpdate(
    query,
    { $set: data },
    { new: true, lean: true }
  );
};

export const getOneByQuery = (query: any, model: string) => {
  return models[model].findOne(query).lean();
};

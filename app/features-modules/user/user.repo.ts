import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IUser } from "./user.types";
import { UserModel } from "./user.schema";

const create = (user: IUser) => UserModel.create(user);

const find = (pipeline: PipelineStage[]) => UserModel.aggregate(pipeline)

const findOne = (filterParam: FilterQuery<IUser>) => UserModel.findOne(filterParam)

const update = (filterParam: FilterQuery<IUser>, data: UpdateQuery<IUser>) => UserModel.updateMany(filterParam, data);

const getRewardInfo = (pipeline: PipelineStage[]) => UserModel.aggregate(pipeline);

const getOwnerLeaderboard = (pipeline: PipelineStage[]) => UserModel.aggregate(pipeline)

export default {
    create, find, findOne, update, getRewardInfo, getOwnerLeaderboard
}
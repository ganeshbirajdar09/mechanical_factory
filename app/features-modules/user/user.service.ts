import { FilterQuery, PipelineStage, Types, UpdateQuery } from "mongoose";
import { IUser } from "./user.types";
import userRepo from "./user.repo";
import authService from "../auth/auth.service";
import { IGenericPipleline, genericPipeline } from "../../utilities/database.utilities";
import { getRewardsEligible } from "../reward/reward.pipelines";
import { onwerLeaderboardPipeline } from "./user.pipelines";

const create = async (user: IUser) => await userRepo.create(user);

const createOwner = async (user: IUser) => await authService.createOwner(user);

const find =  async (queryData: IGenericPipleline) => {
    const pipeline = genericPipeline(queryData)
    const result =  await userRepo.find(pipeline);
    const users = result.map(({password,...user}) =>  user)
    return users
}

const findOne = async (filterParam: FilterQuery<IUser>) => await userRepo.findOne(filterParam);

const removeOwner = async (ownerId: string) => await userRepo.update({ _id: ownerId }, { isDeleted: true })

const getRewardInfo = async (queryData: IGenericPipleline, ownerId: string) => {
    const paginationPipeline: any[] = genericPipeline(queryData)
    const pipeline: any[] = getRewardsEligible(ownerId).concat(paginationPipeline);
    return await userRepo.getRewardInfo(pipeline)
}

const getOwnerLeaderboard = async (queryData: IGenericPipleline) => {
    const paginationPipeline: PipelineStage[] = genericPipeline(queryData);
    const pipeline: PipelineStage[] = onwerLeaderboardPipeline().concat(paginationPipeline);
    return await userRepo.getOwnerLeaderboard(pipeline);
}

const update = async (filterParam: FilterQuery<IUser>, data: UpdateQuery<IUser>) => await userRepo.update(filterParam, data);



export default {
    create, createOwner, find, findOne, removeOwner, update, getRewardInfo, getOwnerLeaderboard
}
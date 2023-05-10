import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IReward } from "./reward.types";
import { RewardModel } from "./reward.schema";
import { IGenericPipleline, genericPipeline } from "../../utilities/database.utilities";

const create = (reward: IReward) => RewardModel.create(reward);

const find = (queryData: IGenericPipleline) => RewardModel.aggregate(genericPipeline(queryData))

const findOne = (filterParam: FilterQuery<IReward>) => RewardModel.findOne(filterParam)

const update = (filterParam: FilterQuery<IReward>, data: UpdateQuery<IReward>) => RewardModel.updateMany(filterParam, data);

export default {
    create, find, findOne, update
}
import { FilterQuery, UpdateQuery } from "mongoose";
import rewardRepo from "./reward.repo";
import { REWARD_RESPONSES } from "./reward.responses";
import { IReward } from "./reward.types";
import userService from "../user/user.service";
import transactionService from "../transaction/transaction.service";
import { IGenericPipleline, genericPipeline } from "../../utilities/database.utilities";
import shopService from "../shop/shop.service";
import { TRANSACTION_RESPONSES } from "../transaction/transaction.responses";
import { TRANSACTION_STATUSES } from "../../utilities/constants";

const create = async (reward: IReward) => {
    const { name } = reward;
    const oldReward = await rewardRepo.findOne({ name: name });
    if (oldReward) throw REWARD_RESPONSES.ALREADY_EXISTS;
    return await rewardRepo.create(reward)
}

const findOne = async (_id: string) => await rewardRepo.findOne({ _id: _id });

const allRewards = async (queryData: IGenericPipleline) => await rewardRepo.find(queryData);

const getOwnerRewardInfo = async (queryData: IGenericPipleline, ownerId: string) => await userService.getRewardInfo(queryData, ownerId)

const ownerLeaderboard = async (queryData: IGenericPipleline) => await userService.getOwnerLeaderboard(queryData)

const shopLeaderboard = async (queryData: IGenericPipleline) => await shopService.getShopLeaderboard(queryData)

const rewardRequests = async (ownerId: string) => await transactionService.findRewardTransactions(ownerId)

const updateReward = async (filterParam: FilterQuery<IReward>, data: UpdateQuery<IReward>) => {
    const product = await rewardRepo.findOne({ _id: filterParam })
    if (!product) throw REWARD_RESPONSES.NOT_FOUND;
    const result = await rewardRepo.update({ _id: filterParam }, data)
    if (result.modifiedCount < 1) throw REWARD_RESPONSES.UPDATE_FAILURE;
    return REWARD_RESPONSES.UPDATE_SUCCESS
}

const removeReward = async (id: string) => {
    const result = await rewardRepo.update({ _id: id }, { isDeleted: true });
    if (result.modifiedCount < 1) throw REWARD_RESPONSES.DELETE_FAILURE;
    return REWARD_RESPONSES.DELETE_SUCCESS
}

const redeemReward = async (ownerId: string, rewardId: string) => {
    const reward = await rewardRepo.findOne({ _id: rewardId });
    const owner = await userService.findOne({ _id: ownerId });

    if (!owner?.points && !reward?.points) throw REWARD_RESPONSES.NOT_FOUND;
    if ((owner?.points as number) - (reward?.points as number) < 0) throw REWARD_RESPONSES.INSUFFICIENT_POINTS;

    const transactionObject = {
        type: "reward",
        ownerId: owner?._id as string,
        reward: reward?._id as string,
        currentRewardPoints: reward?.points as number,

    }
    await transactionService.create(transactionObject)
    return REWARD_RESPONSES.SUCCESSFULL_REDEEM_REQUESTED;
}

const deleteRedeemRequest = async (ownerId: string, requestId: string) => {
    const rewardTransaction = await transactionService.findOne({ _id: requestId })
    if (!rewardTransaction) throw TRANSACTION_RESPONSES.NOT_FOUND

    if (rewardTransaction.status?.toString() == TRANSACTION_STATUSES.APPROVED) throw TRANSACTION_RESPONSES.REDEEM_ALREADY_APPROVED

    await transactionService.update({ _id: rewardTransaction._id }, { isDeleted: true })
    await userService.update({ _id: ownerId }, { $inc: { points: rewardTransaction.currentRewardPoints } })

    return REWARD_RESPONSES.REDEEM_REQUEST_DELETE_SUCCESS
}

export default {
    create, findOne, updateReward, rewardRequests, deleteRedeemRequest, removeReward, redeemReward, allRewards, getOwnerRewardInfo, ownerLeaderboard, shopLeaderboard
}
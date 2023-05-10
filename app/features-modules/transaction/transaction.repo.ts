import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { ITransaction } from "./transaction.types";
import { TransactionModel } from "./transaction.schema";
import { calculateRedeemPoints } from "./transaction.pipelines";

const create = (transaction: ITransaction) => TransactionModel.create(transaction);

const findTransactions = (filterParam: FilterQuery<ITransaction>) => TransactionModel.find(filterParam)
const find = (pipeline: PipelineStage[]) => TransactionModel.aggregate(pipeline)

const findOne = (filterParam: FilterQuery<ITransaction>) => TransactionModel.findOne(filterParam)

const update = (filterParam: FilterQuery<ITransaction>, data: UpdateQuery<ITransaction>) => TransactionModel.updateMany(filterParam, data);

const getPointsToBeRedeemed = (salesId: string) => TransactionModel.aggregate(calculateRedeemPoints(salesId))

// const productWiseTransactionDetails = () => TransactionModel.aggregate()
const productWiseTransactionDetails = (pipeline: PipelineStage[]) => TransactionModel.aggregate(pipeline)


export default {
    create, find, findOne, update, findTransactions, getPointsToBeRedeemed, productWiseTransactionDetails
}
import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { ShopModel } from "./shop.schema";
import { IShop } from "./shop.types";
import { IGenericPipleline, genericPipeline } from "../../utilities/database.utilities";

const create = (shop: IShop) => ShopModel.create(shop);

const find = (queryData: IGenericPipleline) => ShopModel.aggregate(genericPipeline(queryData))
// const find = (pipeline: PipelineStage[]) => ShopModel.aggregate(pipeline)

const findOne = (filterParam: FilterQuery<IShop>) => ShopModel.findOne(filterParam)

const update = (filterParam: FilterQuery<IShop>, data: UpdateQuery<IShop>) => ShopModel.updateMany(filterParam, data);

const shopsRunningLow = (pipeline: PipelineStage[]) => ShopModel.aggregate(pipeline);

const getOwnerLeaderboard = (pipeline: PipelineStage[]) => ShopModel.aggregate(pipeline)

const getShopInventory = (pipeline: PipelineStage[]) => ShopModel.aggregate(pipeline)

const findAllShops = (pipeline: PipelineStage[]) => ShopModel.aggregate(pipeline)

export default {
    create, find, findOne, update, shopsRunningLow, getOwnerLeaderboard,getShopInventory, findAllShops
}
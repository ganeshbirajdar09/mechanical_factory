import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IOrder } from "./order.types";
import { OrderModel } from "./order.schema";
import { IGenericPipleline, genericPipeline } from "../../utilities/database.utilities";


const create = (product: IOrder) => OrderModel.create(product);

const find = (queryData: IGenericPipleline) => OrderModel.aggregate(genericPipeline(queryData))

const findOne = (filterParam: FilterQuery<IOrder>) => OrderModel.findOne(filterParam)

const findOrdersByShop = (shopId: string) => OrderModel.find({ shopId: shopId })

const update = (filterParam: FilterQuery<IOrder>, data: UpdateQuery<IOrder>) => OrderModel.updateMany(filterParam, data);

export default {
    create, find, findOne, update, findOrdersByShop
}





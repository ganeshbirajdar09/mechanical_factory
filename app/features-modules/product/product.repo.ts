import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { ProductModel } from "./product.schema";
import { IProduct } from "./product.types";
import { IGenericPipleline, genericPipeline } from "../../utilities/database.utilities";


const create = (product: IProduct) => ProductModel.create(product);

const find = (pipeline: PipelineStage[]) => ProductModel.aggregate(pipeline)

const findOne = (filterParam: FilterQuery<IProduct>) => ProductModel.findOne(filterParam)

const update = (filterParam: FilterQuery<IProduct>, data: UpdateQuery<IProduct>) => ProductModel.updateMany(filterParam, data);

export default {
    create, find, findOne, update
}
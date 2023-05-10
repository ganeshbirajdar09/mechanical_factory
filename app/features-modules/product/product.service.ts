import { FilterQuery, UpdateQuery } from "mongoose";
import productRepo from "./product.repo"
import { PRODUCT_RESPONSES } from "./product.responses";
import { IProduct } from "./product.types"
import { IGenericPipleline, genericPipeline } from "../../utilities/database.utilities";
import transactionService from "../transaction/transaction.service";


const create = async (product: IProduct) => {
    const { name } = product;

    const oldProduct = await productRepo.findOne({ name: name });
    if (oldProduct) throw PRODUCT_RESPONSES.ALREADY_EXISTS;

    product.points > 0 ? product.isSpecial = true : product.isSpecial = false
    return await productRepo.create(product)
}

const find = async (queryData: IGenericPipleline) => {
    const pipeline  = genericPipeline(queryData)
    return await productRepo.find(pipeline)
}

const findOne = async (productId: string) => await productRepo.findOne({_id: productId})


const updateProduct = async (filterParam: FilterQuery<IProduct>, data: UpdateQuery<IProduct>) => {
    const product = await productRepo.findOne({ _id: filterParam })
    if (!product) throw PRODUCT_RESPONSES.NOT_FOUND;

    const result = await productRepo.update({ _id: filterParam }, data)
    if (result.modifiedCount < 1) throw PRODUCT_RESPONSES.UPDATE_FAILURE;

    return PRODUCT_RESPONSES.UPDATE_SUCCESS
}

const removeProduct = async (id: string) => {
    const result = await productRepo.update({ _id: id }, { isDeleted: true })

    if (result.modifiedCount < 1) throw PRODUCT_RESPONSES.DELETE_FAILURE;
    return PRODUCT_RESPONSES.DELETE_SUCCESS
}

const productWiseHighestSellers = async (queryData: IGenericPipleline) => await transactionService.productWiseTransactionDetails(queryData)


export default {
    find, create, findOne,updateProduct, removeProduct,productWiseHighestSellers
}
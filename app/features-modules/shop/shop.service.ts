import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import authService from "../auth/auth.service";
import { IUser } from "../user/user.types";
import shopRepo from "./shop.repo";
import { IShop, IShopInventory } from "./shop.types";
import transactionService from "../transaction/transaction.service";
import { SHOP_RESPONSE } from "./shop.responses";
import { IGenericPipleline, genericPipeline } from "../../utilities/database.utilities";
import { allShopsPublic, getShopInventory, getShopsLowOnProducts, shopLeaderboardPipeline } from "./shop.pipelines";
import userService from "../user/user.service";
import { ITransaction } from "../transaction/transaction.types";
import { TRANSACTION_RESPONSES } from "../transaction/transaction.responses";
import { TRANSACTION_STATUSES } from "../../utilities/constants";


const create = async (userData: IUser, shop: IShop) => {
    const user = await authService.createOwner(userData);
    shop.ownerId = user._id;
    return await shopRepo.create(shop);
}

const find = async (queryData: IGenericPipleline) => await shopRepo.find(queryData);

const findOne = async (filterParam: FilterQuery<IShop>) => await shopRepo.findOne(filterParam);

const update = async (filterParam: FilterQuery<IUser>, data: UpdateQuery<IUser>) => await shopRepo.update(filterParam, data);

const updateShopDetails = async (shopId: string, location: string) => await shopRepo.update({ _id: shopId }, { $set: { location: location } })

const getInventory = async (shopId: string, queryData: IGenericPipleline) => {
    const shop = await shopRepo.findOne({ _id: shopId });
    if (!shop) throw SHOP_RESPONSE.NOT_FOUND

    const paginationPipeline: any[] = genericPipeline(queryData);
    const pipeline: PipelineStage[] = (getShopInventory(shopId)).concat(paginationPipeline);
    return await shopRepo.getShopInventory(pipeline)
}

const salesRequests = async (ownerId: string) => {
    const shop = await shopRepo.findOne({ ownerId: ownerId });
    if (!shop) throw SHOP_RESPONSE.NOT_FOUND;
    return await transactionService.findSalesTransactions(shop._id as string)
}

const removeShopWithOwner = async (shopId: string) => {
    const shop = await shopRepo.findOne({ _id: shopId });
    if (!shop) throw SHOP_RESPONSE.NOT_FOUND
    await userService.removeOwner(shop.ownerId as string)
    await shopRepo.update({ _id: shopId }, { isDeleted: true })
    return SHOP_RESPONSE.DELETE_SUCCESS
}

const shopsRunningLow = async (queryData: IGenericPipleline) => {
    const paginationPipeline: PipelineStage[] = genericPipeline(queryData)
    const pipeline: PipelineStage[] = getShopsLowOnProducts().concat(paginationPipeline)
    return await shopRepo.shopsRunningLow(pipeline)
}

const getShopLeaderboard = async (queryData: IGenericPipleline) => {
    const paginationPipeline: PipelineStage[] = genericPipeline(queryData);
    const pipeline: PipelineStage[] = (shopLeaderboardPipeline()).concat(paginationPipeline);
    return await shopRepo.getOwnerLeaderboard(pipeline);
}
const updateInventoryOnOrder = async (shopId: string, products: IShopInventory[]) => {
    const shop = await shopRepo.findOne({ _id: shopId });
    for (let product of products) {
        const oldProduct = shop?.inventory?.find(item => item.productId.toString() == product.productId.toString())
        if (!oldProduct) await shopRepo.update({ _id: shop?._id }, { $push: { inventory: product } })
        else {
            const updatedQuantity = oldProduct.quantity + product.quantity;
            await shopRepo.update({ _id: shop?._id, "inventory.productId": oldProduct.productId }, { $set: { "inventory.$.quantity": updatedQuantity } })
        }
    }
}
const updatedQuantityInInventory = async (_id: string, products: IShopInventory[], type: string = "") => {

    const shop = await shopRepo.findOne({ _id: _id })
    if (!shop?.inventory) throw SHOP_RESPONSE.NOT_FOUND
    for (let product of products) {
        const oldProduct = shop.inventory.find(item => item.productId == product.productId.toString())
        if (!oldProduct) {
            await shopRepo.update({ _id: shop._id }, { $push: { inventory: product } })
        }
        else {
            let updatedQuantity = (type == "sales") ? oldProduct.quantity - product.quantity : oldProduct.quantity + product.quantity
            await shopRepo.update({ _id: shop._id, "inventory.productId": oldProduct.productId }, { $set: { "inventory.$.quantity": updatedQuantity } })
        }
    }
}

const salesEntry = async (ownerId: string, salesData: IShopInventory[]) => {
    const shop = await shopRepo.findOne({ ownerId: ownerId })
    if (!shop) throw SHOP_RESPONSE.NOT_FOUND;
    return await transactionService.registerSales(shop._id as string, salesData);

}

const editSales = async (ownerId: string, salesData: UpdateQuery<ITransaction>) => {
    const shop = await shopRepo.findOne({ ownerId: ownerId });
    if (!shop) throw SHOP_RESPONSE.NOT_FOUND;
    return await transactionService.editSales(shop?._id as string, salesData)
}

const deleteSales = async (ownerId: string, salesId: string) => {
    const shop = await shopRepo.findOne({ ownerId: ownerId })
    if (!shop) throw SHOP_RESPONSE.NOT_FOUND;

    const salesTransaction = await transactionService.findOne({ _id: salesId });
    if (salesTransaction?.shopId?.toString() !== shop._id.toString()) return TRANSACTION_RESPONSES.NOT_FOUND
    if (salesTransaction?.status?.toString() === TRANSACTION_STATUSES.APPROVED) throw TRANSACTION_RESPONSES.SALES_ALREADY_APPROVED

    if (salesTransaction.products) {
        for (let product of salesTransaction.products) {
            const { productId, quantity } = product as IShopInventory;
            const oldProduct = shop.inventory?.find(prod => prod.productId?.toString() == productId.toString())
            if (oldProduct) {
                await shopRepo.update({ _id: shop._id, "inventory.productId": productId }, { $inc: { "inventory.$.quantity": quantity } })
            }
            else {
                await shopRepo.update({ _id: shop._id, "inventory.productId": productId }, { $set: { "inventory.$.quantity": quantity } })
            }
        }
    }

    return await transactionService.deleteSales(salesId)

}


const rateShop = async (reviewData: FilterQuery<IShop>) => {
    await shopRepo.update({ _id: reviewData.shopId }, { $push: { reviews: reviewData.rating } })
    await shopRepo.update({ _id: reviewData.shopId }, [{ $set: { rating: { $avg: "$reviews" } } }])
    return SHOP_RESPONSE.SHOP_RATING_SUCCESS
}

const findShop = async (shopId: string) => await shopRepo.findOne({ _id: shopId });

const incrementShopPoints = async (shopId: string, revenue: number, points: number) => {
    await shopRepo.update({ _id: shopId }, { $inc: { allTimeSales: revenue } })
    const result = await shopRepo.update({ _id: shopId }, { $inc: { allTimePoints: Number(points) } })
    return result
}

const allShops = async () => {
    const result = await shopRepo.findAllShops(allShopsPublic())
    return result
}

export default {
    create, find, findOne, incrementShopPoints, updateShopDetails, salesRequests, editSales, deleteSales, removeShopWithOwner, updatedQuantityInInventory, updateInventoryOnOrder, salesEntry, update, shopsRunningLow, getShopLeaderboard, rateShop, getInventory, findShop, allShops
}
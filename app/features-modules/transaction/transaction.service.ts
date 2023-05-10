import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { TRANSACTION_STATUSES } from "../../utilities/constants";
import { IGenericPipleline, convertStringToObjectId, genericPipeline } from "../../utilities/database.utilities";
import rewardService from "../reward/reward.service";
import shopService from "../shop/shop.service";
import userService from "../user/user.service";
import transactionRepo from "./transaction.repo";
import { TRANSACTION_RESPONSES } from "./transaction.responses";
import { ITransaction } from "./transaction.types";
import { getAllSales, getMontlySales, getTopSellingProducts } from "./transaction.pipelines";
import { IShopInventory } from "../shop/shop.types";
import { SHOP_RESPONSE } from "../shop/shop.responses";
import productService from "../product/product.service";
import shopRepo from "../shop/shop.repo";


const create = async (transaction: ITransaction) => await transactionRepo.create(transaction)

const findOne = async (filterParam: FilterQuery<ITransaction>) => await transactionRepo.findOne(filterParam);

const update = async (filterParam: FilterQuery<ITransaction>, data: UpdateQuery<ITransaction>) => await transactionRepo.update(filterParam, data);

const findSalesTransactions = async (shopId: string) => await transactionRepo.findTransactions({ type: 'sales', shopId: shopId })

const findRewardTransactions = async (ownerId: string) => await transactionRepo.findTransactions({ type: 'reward', ownerId: ownerId })

const getAllTransactions = (queryData: IGenericPipleline) => {
    const pipeline = getAllSales(queryData);
    return transactionRepo.find(pipeline)
}

const registerSales = async (shopId: string, salesData: IShopInventory[]) => {
    const shop = await shopService.findOne({ _id: shopId })
    const inventory = shop?.inventory

    let netSales: number = 0;

    for (let item of salesData) {
        const { quantity, productId } = item;
        const product = inventory?.find((prod) => prod.productId.toString() == item.productId.toString())
        if (product && (quantity <= product.quantity)) {
            const productFromInventory = await productService.findOne(productId as string);
            netSales += Number(quantity) * Number((productFromInventory?.price as number));
            await shopService.update({ "inventory.productId": item.productId }, { $inc: { "inventory.$.quantity": quantity * -1 } })
        }
        else {
            throw SHOP_RESPONSE.INSUFFICIENT_QUANTITY
        }
    }
    const transactionObject = {
        type: "sales",
        shopId: shop?._id as string,
        products: salesData,
        netSales: netSales
    }

    const result = await transactionRepo.create(transactionObject)
    if (!result) TRANSACTION_RESPONSES.SOMETHING_WENT_WRONG;
    return SHOP_RESPONSE.SUCCESSFULL_SALES_REGISTRATION
}

const editSales = async (shopId: string, salesData: UpdateQuery<ITransaction>) => {
    const { salesId, products } = salesData;
    const salesTransaction = await transactionRepo.findOne({ _id: salesId });

    if (salesTransaction?.shopId?.toString() !== shopId.toString()) return TRANSACTION_RESPONSES.NOT_FOUND
    if (salesTransaction?.status?.toString() === TRANSACTION_STATUSES.APPROVED) throw TRANSACTION_RESPONSES.SALES_ALREADY_APPROVED

    const result = await transactionRepo.update({ _id: salesTransaction?._id }, { $set: { products: products } })
    if (result.modifiedCount < 1) throw TRANSACTION_RESPONSES.SALES_EDIT_FAILURE;
    return TRANSACTION_RESPONSES.SALES_EDIT_SUCCESS
}

const deleteSales = async (salesId: string) => {
    const result = await transactionRepo.update({ _id: salesId }, { isDeleted: true })
    if (result.modifiedCount < 1) throw TRANSACTION_RESPONSES.DELETE_FAILURE;
    return TRANSACTION_RESPONSES.DELETE_SUCCESS
}

const getRevenueByMonth = async (queryData: IGenericPipleline) => {
    const pipeline = getMontlySales(queryData);
    let { from, to, shopId, status } = queryData;

    const transactionData = await transactionRepo.find(pipeline);
    const { revenue, totalRedeemPoints, _id } = transactionData[0];
    const shop = await shopService.findOne({ _id: _id })

    if (status?.toLowerCase() === "approve") {
        await transactionRepo.update({ shopId: shopId, createdAt: { $gte: new Date(from as Date), $lte: new Date(to as Date) } }, { $set: { status: TRANSACTION_STATUSES.APPROVED } })
        await shopService.incrementShopPoints(shop?._id as string, revenue, totalRedeemPoints)
        await userService.update({ _id: shop?.ownerId }, { $inc: { points: totalRedeemPoints } });
    }
    if (status?.toLowerCase() === "reject") {
        await transactionRepo.update({ shopId: shopId, createdAt: { $gte: new Date(from as Date), $lte: new Date(to as Date) } }, { $set: { status: TRANSACTION_STATUSES.REJECTED } })
    }
    return transactionData
}


const approveRedeemTransaction = async (redeemId: string) => {
    const transaction = await transactionRepo.findOne({ _id: redeemId });
    if (transaction && transaction.type !== "reward") throw TRANSACTION_RESPONSES.NOT_FOUND;

    const owner = await userService.findOne({ _id: transaction?.ownerId });
    const reward = await rewardService.findOne(transaction?.reward as string);

    const updatedOwnerPoints = (owner?.points as number) - (reward?.points as number)

    await userService.update({ _id: owner?._id }, { points: updatedOwnerPoints })
    await userService.update({ _id: owner?._id }, { $push: { rewards: reward?._id } })
    await transactionRepo.update({ _id: transaction?._id }, { $set: { status: TRANSACTION_STATUSES.APPROVED } })

    return TRANSACTION_RESPONSES.REDEEM_REQUEST_APPROVED
}


const setSalesTransactionStatus = async (status: FilterQuery<ITransaction>) => {
    const transaction = await transactionRepo.findOne({ _id: status.salesId });
    if (transaction && transaction.status?.toString() == TRANSACTION_STATUSES.APPROVED) throw TRANSACTION_RESPONSES.SALES_ALREADY_APPROVED

    const products = transaction?.products;

    if (transaction && transaction.type != "sales") throw TRANSACTION_RESPONSES.NOT_FOUND;

    if (status.status.toString() == TRANSACTION_STATUSES.REJECTED) {
        if (transaction?.status?.toString() == TRANSACTION_STATUSES.REJECTED) throw TRANSACTION_RESPONSES.SALES_ALREADY_REJECTED;
        await transactionRepo.update({ _id: transaction?._id }, { $set: { status: TRANSACTION_STATUSES.REJECTED } });
        return TRANSACTION_RESPONSES.SALES_TRANSACTION_REJECTED;
    }

    const shop = await shopService.findOne({ _id: transaction?.shopId });
    const owner = await userService.findOne({ _id: shop?.ownerId });
    const redeemPointsArray = await transactionRepo.getPointsToBeRedeemed(status.salesId);
    if (redeemPointsArray.length == 0) {
        await shopService.incrementShopPoints(shop?._id as string, transaction?.netSales as number, 0)
    }
    else {
        await shopService.incrementShopPoints(shop?._id as string, transaction?.netSales as number, redeemPointsArray[0].totalRedeemPoints)
        await userService.update({ _id: owner?._id }, { $inc: { points: redeemPointsArray[0].totalRedeemPoints } });
    }

    await shopService.updatedQuantityInInventory((shop?._id as string), (products as IShopInventory[]), "sales")
    await transactionRepo.update({ _id: transaction?._id }, { $set: { status: TRANSACTION_STATUSES.APPROVED } });
    return TRANSACTION_RESPONSES.SALES_TRANSACTION_APPROVED;
}

const productWiseTransactionDetails = async (queryData: IGenericPipleline) => {
    const paginationPipeline: any[] = genericPipeline(queryData)
    const pipeline: any[] = getTopSellingProducts().concat(paginationPipeline)
    return await transactionRepo.productWiseTransactionDetails(pipeline)
}

const getTransactionById = async (id: string) => await transactionRepo.findOne({ _id: id })
export default {
    create, findOne, registerSales, update, editSales, deleteSales, findSalesTransactions, findRewardTransactions, getTransactionById, getRevenueByMonth, getAllTransactions, approveRedeemTransaction, setSalesTransactionStatus, productWiseTransactionDetails
}
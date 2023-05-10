import { UpdateQuery } from "mongoose";
import orderRepo from "./order.repo"
import { ORDER_RESPONSES } from "./order.responses";
import { IOrder } from "./order.types"
import shopService from "../shop/shop.service";
import { TRANSACTION_STATUSES } from "../../utilities/constants";
import { SHOP_RESPONSE } from "../shop/shop.responses";
import { IGenericPipleline, } from "../../utilities/database.utilities";

import { PRODUCT_RESPONSES } from "../product/product.responses";
import productService from "../product/product.service";

const create = async (order: IOrder, ownerId: string) => {
    const shop = await shopService.findOne({ ownerId: ownerId })
    if (!shop) throw ORDER_RESPONSES.NOT_FOUND;
    const { products } = order;
    for (let product of products) {
        const doesProductExists = await productService.findOne(product.productId);
        if (!doesProductExists) throw PRODUCT_RESPONSES.NOT_FOUND;
    }
    order.shopId = shop._id
    return await orderRepo.create(order)
}
const findAll = async (queryData: IGenericPipleline) => await orderRepo.find(queryData)

const findOne = async (orderId: string) => await orderRepo.findOne({ _id: orderId });

const findOrdersByShop = async (ownerId: string) => {
    const shop = await shopService.findOne({ ownerId: ownerId });
    if (!shop) throw SHOP_RESPONSE.NOT_FOUND;

    const result = await orderRepo.findOrdersByShop(shop._id as string)
    return result
}

const confirmOwnerAndOrder = async (ownerId: string, orderId: string) => {
    const order = await orderRepo.findOne({ _id: orderId });
    if (!order) throw ORDER_RESPONSES.NOT_FOUND

    const shop = await shopService.findOne({ ownerId: ownerId })
    if (!shop) throw SHOP_RESPONSE.NOT_FOUND;

    if (order.shopId?.toString() != shop._id.toString()) return false
    if (order?.status?.toString() == TRANSACTION_STATUSES.APPROVED) return false

    return true
}

const onwerEditOrder = async (ownerId: string, data: UpdateQuery<IOrder>) => {
    const { orderId, products } = data;

    const check = confirmOwnerAndOrder(ownerId, orderId)
    if (!check) throw ORDER_RESPONSES.NOT_FOUND

    const result = await orderRepo.update({ _id: orderId }, { $set: { products: products } })
    if (result.modifiedCount < 1) throw ORDER_RESPONSES.UPDATE_FAILURE;

    return ORDER_RESPONSES.UPDATE_SUCCESS
}

const removeOrder = async (ownerId: string, orderId: string) => {

    // const check = confirmOwnerAndOrder(ownerId, orderId)
    // if (!check) throw ORDER_RESPONSES.NOT_FOUND

    const order = await orderRepo.findOne({ _id: orderId });
    if (!order) throw ORDER_RESPONSES.NOT_FOUND

    const shop = await shopService.findOne({ ownerId: ownerId })
    if (!shop) throw SHOP_RESPONSE.NOT_FOUND;

    const result = await orderRepo.update({ _id: orderId }, { isDeleted: true })
    if (result.modifiedCount < 1) throw ORDER_RESPONSES.DELETE_FAILURE;
    return ORDER_RESPONSES.DELETE_SUCCESS
}

const approveOrder = async (_id: string, productId: string = "") => {
    const order = await orderRepo.findOne({ _id: _id })
    if (!order) throw ORDER_RESPONSES.NOT_FOUND;
    if (order.status?.toString() == TRANSACTION_STATUSES.APPROVED) throw ORDER_RESPONSES.ALREADY_APPROVED

    const shop = await shopService.findOne({ _id: order.shopId })
    if (!shop) throw SHOP_RESPONSE.NOT_FOUND

    //approve the whole order
    if (!productId) {
        const productsToUpdate = order.products.filter(prod => prod.status?.toString() !== TRANSACTION_STATUSES.APPROVED)

        await shopService.updateInventoryOnOrder(shop._id.toString(), productsToUpdate);
        await orderRepo.update({ _id: order._id }, { $set: { status: TRANSACTION_STATUSES.APPROVED } });

        const result = await orderRepo.update({ _id: order._id }, { $set: { "products.$[].status": TRANSACTION_STATUSES.APPROVED } })
        if (result.modifiedCount < 1) throw ORDER_RESPONSES.UPDATE_FAILURE;
        return ORDER_RESPONSES.UPDATE_SUCCESS
    }

    //approve that one particular product
    const product = order.products.find(item => item.productId.toString() == productId.toString());
    if (!product) throw PRODUCT_RESPONSES.NOT_FOUND;

    await shopService.update({ "inventory.productId": product.productId }, { $inc: { "inventory.$.quantity": product.quantity } })
    await orderRepo.update({ "products.productId": productId }, { $set: { "products.$.status": TRANSACTION_STATUSES.APPROVED } })
    return ORDER_RESPONSES.UPDATE_SUCCESS
}
export default {
    create, removeOrder, findOne, approveOrder, findAll, onwerEditOrder, findOrdersByShop
}
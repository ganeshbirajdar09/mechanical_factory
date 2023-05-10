import { IProduct } from "../product/product.types";
import { IShopInventory } from "../shop/shop.types";

export interface ITransaction {
    _id?: string,
    type: string,
    ownerId?: string,
    shopId?: string,
    products?: IProduct[] | IShopInventory[],
    reward?: string,
    status?: string,
    netSales?: number,
    currentRewardPoints?: number
}
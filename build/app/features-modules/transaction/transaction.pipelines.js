"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMontlySales = exports.getAllSales = exports.getTopSellingProducts = exports.calculateRedeemPoints = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../utilities/constants");
const database_utilities_1 = require("../../utilities/database.utilities");
const calculateRedeemPoints = (salesId) => [
    {
        $match: {
            "_id": new mongoose_1.Types.ObjectId(salesId)
        }
    },
    {
        $unwind: "$products"
    },
    {
        $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "item"
        }
    },
    {
        $unwind: "$item"
    },
    {
        $match: {
            "item.isSpecial": true
        }
    },
    {
        $project: {
            _id: 0,
            totalRedeemPoints: { $sum: { $multiply: ["$products.quantity", "$item.points"] } }
        }
    }
];
exports.calculateRedeemPoints = calculateRedeemPoints;
const getTopSellingProducts = () => [
    {
        $match: {
            type: "sales",
            status: new mongoose_1.Types.ObjectId(constants_1.TRANSACTION_STATUSES.APPROVED)
        }
    },
    {
        $unwind: "$products"
    },
    {
        $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "item"
        }
    },
    {
        $group: {
            _id: {
                product: { $arrayElemAt: ["$item", 0] },
                // productId: "$products.productId",
            },
            totalQuantity: { $sum: "$products.quantity" }
        }
    },
    {
        $sort: {
            totalSales: -1
        }
    },
    {
        $project: {
            _id: 0,
            product: "$_id.product.name",
            productId: "$_id.product._id",
            totalQuantity: 1
        }
    }
];
exports.getTopSellingProducts = getTopSellingProducts;
const getAllSales = (queryData) => {
    let { shopId } = queryData;
    const pipeline = [{
            $match: {
                isDeleted: false,
                status: new mongoose_1.Types.ObjectId(constants_1.TRANSACTION_STATUSES.PENDING) || new mongoose_1.Types.ObjectId(constants_1.TRANSACTION_STATUSES.APPROVED)
            },
        }];
    if (shopId) {
        pipeline.push({
            $match: { shopId: shopId }
        });
    }
    return pipeline.concat((0, database_utilities_1.genericPipeline)(queryData));
};
exports.getAllSales = getAllSales;
const getMontlySales = (filters) => {
    const { from, to, shopId } = filters;
    const pipeline = [
        {
            $match: {
                shopId: shopId,
                isDeleted: false,
                status: new mongoose_1.Types.ObjectId(constants_1.TRANSACTION_STATUSES.PENDING),
                createdAt: { $gte: new Date(from) },
            }
        },
        {
            $match: {
                createdAt: { $lte: new Date(to) },
            }
        },
        {
            $unwind: "$products"
        },
        {
            $lookup: {
                from: "products",
                localField: "products.productId",
                foreignField: "_id",
                as: "item"
            }
        },
        {
            $unwind: "$item"
        },
        {
            $match: {
                "item.isSpecial": true
            }
        },
        {
            $group: {
                _id: shopId,
                revenue: { $sum: "$netSales" },
                totalRedeemPoints: { $sum: { $multiply: ["$products.quantity", "$item.points"] } }
            }
        }
    ];
    return pipeline;
};
exports.getMontlySales = getMontlySales;
// export const getProductWiseTopSeller = () => [
//   {
//     $match: {
//       type: "sales",
//       status: TRANSACTION_STATUSES.APPROVED
//     }
//   },
//   {
//     $unwind: "$products"
//   },
//   {
//     $group: {
//       _id: {
//         productId: "$products.productId"
//       },
//       quantity: {
//         allTimeTotalSales: { $sum: "$products.quantity" }
//       }
//     }
//   },
//   {
//     "$sort": {
//       allTimeTotalSales: -1
//     }
//   },
//   {
//     "$group": {
//       "_id": "$product._id",
//       product: {
//         $first: "$product"
//       },
//       shop: {
//         $first: "$shop"
//       },
//       quantity: {
//         $first: "$quantity"
//       },
//     }
//   },
//   {
//     $sort: {
//       quantity: -1
//     }
//   },
//   {
//     $project: {
//       name: "$products.productId",
//       totalQuantity: 1
//     }
//   }
// ]

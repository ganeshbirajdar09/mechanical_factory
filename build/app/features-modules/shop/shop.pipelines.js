"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allShopsPublic = exports.getShopInventory = exports.getShopsLowOnProducts = exports.shopLeaderboardPipeline = void 0;
const mongoose_1 = require("mongoose");
const shopLeaderboardPipeline = () => [
    {
        $match: {
            isDeleted: false
        }
    },
    {
        $sort: {
            "points": -1
        }
    },
    {
        $project: {
            _id: 1,
            ownerId: 1,
            location: 1,
            allTimePoints: 1
        }
    }
];
exports.shopLeaderboardPipeline = shopLeaderboardPipeline;
const getShopsLowOnProducts = () => [
    {
        $match: { isDeleted: false }
    },
    {
        $unwind: "$inventory"
    },
    {
        $lookup: {
            from: "products",
            localField: "inventory.productId",
            foreignField: "_id",
            as: "items"
        }
    },
    {
        $addFields: {
            runningLowOn: {
                $filter: {
                    input: "$items",
                    as: "items",
                    cond: {
                        $lt: ["$inventory.quantity", "$$items.threshold"]
                    }
                }
            }
        }
    },
    {
        $unwind: "$runningLowOn"
    },
    {
        $addFields: {
            diff: {
                $subtract: ["$runningLowOn.threshold", "$inventory.quantity"]
            }
        }
    },
    {
        $group: {
            _id: "$_id",
            runningLowOn: {
                $push: {
                    product: "$runningLowOn.name",
                    productId: "$runningLowOn._id",
                    diff: "$diff"
                }
            }
        }
    },
    {
        $project: {
            _id: 1,
            runningLowOn: 1
        }
    }
];
exports.getShopsLowOnProducts = getShopsLowOnProducts;
const getShopInventory = (shopId) => [
    {
        $match: { _id: new mongoose_1.Types.ObjectId(shopId) }
    },
    {
        $unwind: "$inventory"
    },
    {
        $lookup: {
            from: "products",
            localField: "inventory.productId",
            foreignField: "_id",
            as: "items"
        }
    },
    {
        $addFields: {
            "inventory.product": { $arrayElemAt: ["$items.name", 0] },
            "inventory.isRunningLow": {
                $cond: {
                    if: { $lte: ["$inventory.quantity", { $arrayElemAt: ["$items.threshold", 0] }] },
                    then: true,
                    else: true
                }
            }
        }
    },
    {
        $group: {
            _id: "$inventory"
        }
    },
];
exports.getShopInventory = getShopInventory;
const allShopsPublic = () => [
    {
        $match: {
            isDeleted: false
        }
    },
    {
        $project: {
            location: 1,
            rating: 1,
            _id: 0
        }
    }
];
exports.allShopsPublic = allShopsPublic;
// export const getShopsLowOnProducts: () => PipelineStage[] = () => [
//   {
//     $match: {isDeleted: false}
//   },
//   {
//     $unwind: "$inventory"
//   },
//   {
//     $lookup: {
//       from: "products",
//       localField: "inventory.productId",
//       foreignField: "_id",
//       as: "items"
//     }
//   },
//   {
//     $addFields: {
//       runningLowOn: {
//         $filter: {
//           input: "$items",
//           as: "items",
//           cond: {
//             $lt: ["$inventory.quantity", "$$items.threshold"]
//           }
//         }
//       }
//     }
//   },
//   {
//     $unwind: "$runningLowOn"
//   },
//   {
//     $addFields: {
//       diff: {
//         $subtract: ["$runningLowOn.threshold", "$inventory.quantity"]
//       }
//     }
//   },
//   {
//     $group: {
//       _id: "$_id",
//       runningLowOn: {
//         $push: {
//           product: "$runningLowOn.name",
//           productId: "$runningLowOn._id",
//           diff: "$diff"
//         }
//       }
//     }
//   },
//   {
//     $project: {
//       _id: 1,
//       runningLowOn: 1
//     }
//   }
// ]

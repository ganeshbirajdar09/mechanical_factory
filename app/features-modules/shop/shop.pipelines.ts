import { PipelineStage, Types } from "mongoose";

export const shopLeaderboardPipeline: () => PipelineStage[] = () => [
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
]

export const getShopsLowOnProducts: () => PipelineStage[] = () => [
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
]
export const getShopInventory = (shopId: string) => [
  {
    $match: { _id: new Types.ObjectId(shopId) }
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
]

export const allShopsPublic = () => [
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
]
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


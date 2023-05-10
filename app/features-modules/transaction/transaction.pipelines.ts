import { PipelineStage, Types } from "mongoose"
import { TRANSACTION_STATUSES } from "../../utilities/constants"
import { IGenericPipleline, genericPipeline } from "../../utilities/database.utilities"

export const calculateRedeemPoints = (salesId: string) => [
  {
    $match: {
      "_id": new Types.ObjectId(salesId)
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
]

export const getTopSellingProducts = () => [
  {
    $match: {
      type: "sales",
      status: new Types.ObjectId(TRANSACTION_STATUSES.APPROVED)
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

]
export const getAllSales = (queryData: IGenericPipleline) => {
  let { shopId } = queryData;
  const pipeline: PipelineStage[] = [{
    $match: {
      isDeleted: false,
      status: new Types.ObjectId(TRANSACTION_STATUSES.PENDING) || new Types.ObjectId(TRANSACTION_STATUSES.APPROVED)
    },
  }]

  if (shopId) {
    pipeline.push({
      $match: { shopId: shopId }
    })
  }

  return pipeline.concat(genericPipeline(queryData))
}

export const getMontlySales = (filters: IGenericPipleline) => {
  const { from, to, shopId } = filters;


  const pipeline: PipelineStage[] = [
    {
      $match: {
        shopId: shopId,
        isDeleted: false,
        status: new Types.ObjectId(TRANSACTION_STATUSES.PENDING),
        createdAt: { $gte: new Date(from as Date) },
      }
    },
    {
      $match: {
        createdAt: { $lte: new Date(to as Date) },
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
  ]
  return pipeline


}
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


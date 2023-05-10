import { PipelineStage, Types } from "mongoose";


export const getRewardsEligible = (ownerId: string) => [
    { $match: { _id: new Types.ObjectId(ownerId) } },
    {
        $lookup: {
            from: "rewards",
            let: { points: "$points" },
            pipeline: [
                { $match: { $expr: { $lte: ["$points", "$$points"] } } },
                { $sort: { points: 1 } },
            ],
            as: "eligibleRewards"
        }
    },
    {
        $lookup: {
            from: "rewards",
            let: { points: "$points" },
            pipeline: [
                { $match: { $expr: { $gt: ["$points", "$$points"] } } },
                { $sort: { points: 1 } }
            ],
            as: "nextRewards"
        }
    },
    {
        $project: {
            _id: 1,
            name: 1,
            points: 1,
            rewards: 1,
            eligibleRewards: 1,
            nextReward: { $arrayElemAt: ["$nextRewards", 0] }
        }
    }
]


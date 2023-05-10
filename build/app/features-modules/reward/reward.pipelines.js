"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRewardsEligible = void 0;
const mongoose_1 = require("mongoose");
const getRewardsEligible = (ownerId) => [
    { $match: { _id: new mongoose_1.Types.ObjectId(ownerId) } },
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
];
exports.getRewardsEligible = getRewardsEligible;

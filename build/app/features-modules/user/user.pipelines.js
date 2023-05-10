"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onwerLeaderboardPipeline = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../utilities/constants");
const onwerLeaderboardPipeline = () => [
    {
        $match: {
            role: new mongoose_1.Types.ObjectId(constants_1.ROLES.OWNER),
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
            name: 1,
            points: 1
        }
    }
];
exports.onwerLeaderboardPipeline = onwerLeaderboardPipeline;

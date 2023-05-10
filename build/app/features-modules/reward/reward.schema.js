"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utilities/base-schema");
const RewardSchema = new base_schema_1.BaseSchema({
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true,
        default: 0
    }
});
exports.RewardModel = (0, mongoose_1.model)("reward", RewardSchema);

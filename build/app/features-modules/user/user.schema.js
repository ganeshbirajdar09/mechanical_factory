"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utilities/base-schema");
const UserSchema = new base_schema_1.BaseSchema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false
    },
    points: {
        type: Number,
        default: 0
    },
    rewards: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "reward",
        default: []
    }
});
exports.UserModel = (0, mongoose_1.model)("user", UserSchema);

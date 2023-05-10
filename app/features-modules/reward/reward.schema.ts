import { model } from "mongoose";
import { BaseSchema } from "../../utilities/base-schema";
import { IReward } from "./reward.types";

const RewardSchema = new BaseSchema({
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true,
        default: 0
    }
})
type RewardDocument = Document & IReward;

export const RewardModel = model<RewardDocument>("reward", RewardSchema)


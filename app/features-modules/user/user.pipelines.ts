import { PipelineStage, Types } from "mongoose";
import { ROLES } from "../../utilities/constants";

export const onwerLeaderboardPipeline: () => PipelineStage[] = () => [
    {
        $match: {
            role: new Types.ObjectId(ROLES.OWNER),
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
]

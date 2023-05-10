import { query } from "express-validator";
import { PipelineStage, Types } from "mongoose";
import { validate } from "./validate";

export const convertStringToObjectId = (id: string) => new Types.ObjectId(id);

export type AggregatePipeline = PipelineStage[] & IGenericPipleline & IGenericPipleline[]

const generateRangeExpression = (key: string, matchFilter: MatchFilter) => {
    for (let val of matchFilter[key]) {
        val = Number(val)
    }
    const expression = { $gte: Math.min(...matchFilter[key]), $lte: Math.max(...matchFilter[key]) };
    return expression
}

export interface IGenericPipleline {
    filters?: any,
    limit?: number,
    page?: string,
    sortFilter?: string,
    sortOrder?: string | number,
    from?: Date,
    to?: Date,
    shopId?: string,
    isDeleted?: string,
    status?: string
}
type MatchFilter = any

//GENERIC PIPELINE FOR PAGINATION,FILTERING,SORTING
export const genericPipeline = (queryData: IGenericPipleline) => {

    let { limit, page, sortOrder, sortFilter, from, to, ...filter } = queryData;

    if (!page) page = "1"
    let itemLimit = +(limit || 5);
    let skipItems = (Number(page) - 1) * itemLimit;

    const numericFields = ["price", "points", "rating", "allTimeSales", "allTimePoints", "netSales"];

    let matchFilter: MatchFilter = filter;

    for (let key in matchFilter) {
        if (numericFields.includes(key)) {
            if (typeof matchFilter[key] == "object") {
                matchFilter[key] = generateRangeExpression(key, matchFilter)
            }
            else {
                matchFilter[key] = Number(matchFilter[key])
            }
        }
    }

    const pipeline: PipelineStage[] | IGenericPipleline[] = [
        { $match: matchFilter },
    ]


    from ? pipeline.push({
        $match: {
            createdAt: { $gte: new Date(from as Date) }
        }
    }) : null;

    to ? pipeline.push({
        $match: {
            createdAt: { $lte: new Date(to as Date) }
        }
    }) : null;

    pipeline.push(
        { $skip: skipItems },
        { $limit: itemLimit }
    )

    if (sortFilter) pipeline.push({
        $sort: {
            [sortFilter as string]: sortOrder == "desc" ? -1 : 1
        }
    })

    return pipeline
}


//validations for genericPipeline
export const PAGINATION_VALIDATIONS = [
    query("page").optional().isNumeric().withMessage("page value must be numeric"),
    query("limit").optional().isNumeric().withMessage("limit value must be numeric"),
    query("sortFilter").optional().isString().isLength({ min: 1 }).withMessage("sortFilter must be string"),
    query("sortOrder").optional().isString().isLength({ min: 3 }).isIn(["asc", "dsc"]).withMessage("must be eithr asc or dsc"),
    validate
]
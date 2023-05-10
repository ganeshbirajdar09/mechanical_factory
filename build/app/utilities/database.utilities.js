"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGINATION_VALIDATIONS = exports.genericPipeline = exports.convertStringToObjectId = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = require("mongoose");
const validate_1 = require("./validate");
const convertStringToObjectId = (id) => new mongoose_1.Types.ObjectId(id);
exports.convertStringToObjectId = convertStringToObjectId;
const generateRangeExpression = (key, matchFilter) => {
    for (let val of matchFilter[key]) {
        val = Number(val);
    }
    const expression = { $gte: Math.min(...matchFilter[key]), $lte: Math.max(...matchFilter[key]) };
    return expression;
};
//GENERIC PIPELINE FOR PAGINATION,FILTERING,SORTING
const genericPipeline = (queryData) => {
    let { limit, page, sortOrder, sortFilter, from, to } = queryData, filter = __rest(queryData, ["limit", "page", "sortOrder", "sortFilter", "from", "to"]);
    if (!page)
        page = "1";
    let itemLimit = +(limit || 5);
    let skipItems = (Number(page) - 1) * itemLimit;
    const numericFields = ["price", "points", "rating", "allTimeSales", "allTimePoints", "netSales"];
    let matchFilter = filter;
    for (let key in matchFilter) {
        if (numericFields.includes(key)) {
            if (typeof matchFilter[key] == "object") {
                matchFilter[key] = generateRangeExpression(key, matchFilter);
            }
            else {
                matchFilter[key] = Number(matchFilter[key]);
            }
        }
    }
    const pipeline = [
        { $match: matchFilter },
    ];
    from ? pipeline.push({
        $match: {
            createdAt: { $gte: new Date(from) }
        }
    }) : null;
    to ? pipeline.push({
        $match: {
            createdAt: { $lte: new Date(to) }
        }
    }) : null;
    pipeline.push({ $skip: skipItems }, { $limit: itemLimit });
    if (sortFilter)
        pipeline.push({
            $sort: {
                [sortFilter]: sortOrder == "desc" ? -1 : 1
            }
        });
    return pipeline;
};
exports.genericPipeline = genericPipeline;
//validations for genericPipeline
exports.PAGINATION_VALIDATIONS = [
    (0, express_validator_1.query)("page").optional().isNumeric().withMessage("page value must be numeric"),
    (0, express_validator_1.query)("limit").optional().isNumeric().withMessage("limit value must be numeric"),
    (0, express_validator_1.query)("sortFilter").optional().isString().isLength({ min: 1 }).withMessage("sortFilter must be string"),
    (0, express_validator_1.query)("sortOrder").optional().isString().isLength({ min: 3 }).isIn(["asc", "dsc"]).withMessage("must be eithr asc or dsc"),
    validate_1.validate
];

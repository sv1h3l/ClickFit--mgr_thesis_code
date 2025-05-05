"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGraphsCont = void 0;
const createDefaultGraphOrderNumberMod_1 = require("../../models/create/createDefaultGraphOrderNumberMod");
const getDefaultGraphsMod_1 = require("../../models/get/getDefaultGraphsMod");
const getDefaultGraphsOrderNumbersMod_1 = require("../../models/get/getDefaultGraphsOrderNumbersMod");
const getHighestDefaultGraphsOrderNumberModNEW_1 = require("../../models/get/getHighestDefaultGraphsOrderNumberModNEW");
const getHighestGraphsOrderNumberMod_1 = require("../../models/get/getHighestGraphsOrderNumberMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const getUserGraphsMod_1 = require("../../models/get/getUserGraphsMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getGraphsCont = async (req, res) => {
    const { sportId } = req.query;
    if (!sportId) {
        res.status(400).json({ message: "Nevalidní ID sportu" });
        return;
    }
    const sportIdNumber = Number(sportId);
    if (isNaN(sportIdNumber)) {
        res.status(400).json({ message: "ID sportu musí být číslo" });
        return;
    }
    else if (sportIdNumber < 1) {
        res.status(400).json({ message: "Nevalidní ID sportu" });
    }
    try {
        const userAtrs = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req });
        if (userAtrs.status !== GenResEnum_1.GenEnum.SUCCESS || !userAtrs.data) {
            res.status(userAtrs.status).json({ message: userAtrs.message });
            return;
        }
        const dbGetDefaultGraphsRes = await (0, getDefaultGraphsMod_1.getDefaultGraphsMod)({ sportId: sportIdNumber });
        let highestOrderNumber = 0;
        const resHighestDefaultOrderNumber = await (0, getHighestDefaultGraphsOrderNumberModNEW_1.getHighestDefaultGraphsOrderNumberModNEW)({ userId: userAtrs.data?.userId });
        const resHighestUserOrderNumber = await (0, getHighestGraphsOrderNumberMod_1.getHighestGraphsOrderNumberMod)({ userId: userAtrs.data?.userId });
        highestOrderNumber = resHighestDefaultOrderNumber.data?.highestOrderNumber + resHighestUserOrderNumber.data?.highestOrderNumber + 1;
        let formattedGraphs = [];
        if (dbGetDefaultGraphsRes.status === 200 && dbGetDefaultGraphsRes.data) {
            const graphPromises = dbGetDefaultGraphsRes.data.map(async (graph) => {
                const dbGetDefaultGraphOrderNumberRes = await (0, getDefaultGraphsOrderNumbersMod_1.getDefaultGraphOrderNumberMod)({ userId: userAtrs.data?.userId, graphId: graph.graph_id });
                let newDefaultGraphOnId;
                if (dbGetDefaultGraphOrderNumberRes.status === GenResEnum_1.GenEnum.NOT_FOUND) {
                    newDefaultGraphOnId = await (0, createDefaultGraphOrderNumberMod_1.createDefaultGraphOrderNumberMod)({ userId: userAtrs.data?.userId, graphId: graph.graph_id, highestOrderNumber });
                    highestOrderNumber = highestOrderNumber + 1;
                }
                const newGraph = {
                    graphId: newDefaultGraphOnId?.data ? newDefaultGraphOnId.data.defaultGraphOrderNumberId : graph.graph_id,
                    graphLabel: graph.graph_label,
                    hasDate: graph.has_date,
                    orderNumber: newDefaultGraphOnId?.data ? highestOrderNumber - 1 : dbGetDefaultGraphOrderNumberRes.data?.order_number,
                    defaultGraphOrderNumberId: dbGetDefaultGraphOrderNumberRes.data?.default_graph_order_number_id,
                    yAxisLabel: graph.y_axis_label,
                    xAxisLabel: graph.x_axis_label,
                    unit: graph.unit,
                    hasGoals: graph.has_goals,
                };
                return newGraph;
            });
            // Počkej na všechny promisy, než odešleš odpověď
            formattedGraphs = await Promise.all(graphPromises);
        }
        const dbResUserGraphs = await (0, getUserGraphsMod_1.getUserGraphsMod)({ sportId: sportIdNumber, userId: userAtrs.data.userId });
        if (dbResUserGraphs.status === 200 && dbResUserGraphs.data) {
            dbResUserGraphs.data.forEach((graph) => {
                const newGraph = {
                    graphId: graph.graph_id,
                    graphLabel: graph.graph_label,
                    hasDate: graph.has_date,
                    orderNumber: graph.order_number,
                    defaultGraphOrderNumberId: undefined,
                    hasGoals: graph.has_goals,
                    unit: graph.unit,
                    yAxisLabel: graph.y_axis_label,
                    xAxisLabel: graph.x_axis_label,
                };
                formattedGraphs.push(newGraph);
            });
        }
        formattedGraphs.sort((a, b) => a.orderNumber - b.orderNumber);
        res.status(200).json({ message: "Grafy předány", data: formattedGraphs });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getGraphsCont = getGraphsCont;
//# sourceMappingURL=getGraphsCont.js.map
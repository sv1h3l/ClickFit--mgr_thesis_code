"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphValueCont = void 0;
const createGraphValueMod_1 = require("../../models/create/createGraphValueMod");
const getHighestGraphValuesOrderNumberMod_1 = require("../../models/get/getHighestGraphValuesOrderNumberMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const createGraphValueCont = async (req, res) => {
    const { graphId, yAxisValue, xAxisValue, isGoal, isDefaultGraphValue } = req.body;
    if (!graphId || graphId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID grafu" });
        return;
    }
    if (!yAxisValue || !xAxisValue) {
        res.status(400).json({ message: "Hodnoty nesmí být prázdné" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: graphId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.GRAPH_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const resHighestUserOrderNumber = await (0, getHighestGraphValuesOrderNumberMod_1.getHighestGraphValuesOrderNumberMod)({ userId: checkRes.data?.userId, graphId, isDefaultGraphValue });
        let highestOrderNumber = 1;
        if (resHighestUserOrderNumber.status === GenResEnum_1.GenEnum.SUCCESS && resHighestUserOrderNumber.data?.highestOrderNumber)
            highestOrderNumber = resHighestUserOrderNumber.data?.highestOrderNumber + 1;
        const dbResult = await (0, createGraphValueMod_1.createGraphValueMod)({ graphId, userId: checkRes.data?.userId, yAxisValue, xAxisValue, isGoal, isDefaultGraphValue, orderNumber: highestOrderNumber });
        res.status(dbResult.status).json({ message: dbResult.message, data: { graphValueId: dbResult.data?.graphValueId, orderNumber: highestOrderNumber } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.createGraphValueCont = createGraphValueCont;
//# sourceMappingURL=createGraphValueCont.js.map
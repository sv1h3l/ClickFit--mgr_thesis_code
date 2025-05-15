"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphCont = void 0;
const createDefaultGraphMod_1 = require("../../models/create/createDefaultGraphMod");
const createDefaultGraphOrderNumberMod_1 = require("../../models/create/createDefaultGraphOrderNumberMod");
const createGraphMod_1 = require("../../models/create/createGraphMod");
const getHighestDefaultGraphsOrderNumberModNEW_1 = require("../../models/get/getHighestDefaultGraphsOrderNumberModNEW");
const getHighestGraphsOrderNumberMod_1 = require("../../models/get/getHighestGraphsOrderNumberMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
var HelperTextCodeEnum;
(function (HelperTextCodeEnum) {
    HelperTextCodeEnum[HelperTextCodeEnum["GRAPH_LABEL"] = 1] = "GRAPH_LABEL";
    HelperTextCodeEnum[HelperTextCodeEnum["Y_AXIS_LABEL"] = 2] = "Y_AXIS_LABEL";
    HelperTextCodeEnum[HelperTextCodeEnum["X_AXIS_LABEL"] = 3] = "X_AXIS_LABEL";
    HelperTextCodeEnum[HelperTextCodeEnum["UNIT"] = 6] = "UNIT";
})(HelperTextCodeEnum || (HelperTextCodeEnum = {}));
const createGraphCont = async (req, res) => {
    const { sportId, graphLabel, hasDate, xAxisLabel, yAxisLabel, unit, hasGoals, createDefGraph } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    let helperTexts = {};
    let error = false;
    if (graphLabel.length < 1) {
        helperTexts[HelperTextCodeEnum.GRAPH_LABEL] = "Název grafu nesmí být prázdný";
        error = true;
    }
    else if (graphLabel.length > 50) {
        helperTexts[HelperTextCodeEnum.GRAPH_LABEL] = "Název grafu nesmí mít víc než 50 znaků";
        error = true;
    }
    else {
        helperTexts[HelperTextCodeEnum.GRAPH_LABEL] = "";
    }
    if (yAxisLabel.length < 1) {
        helperTexts[HelperTextCodeEnum.Y_AXIS_LABEL] = "Název osy Y nesmí být prázdný";
        error = true;
    }
    else if (yAxisLabel.length > 20) {
        helperTexts[HelperTextCodeEnum.Y_AXIS_LABEL] = "Název osy Y nesmí mít víc než 20 znaků";
        error = true;
    }
    else {
        helperTexts[HelperTextCodeEnum.Y_AXIS_LABEL] = "";
    }
    if (!hasDate && xAxisLabel.length < 1) {
        helperTexts[HelperTextCodeEnum.X_AXIS_LABEL] = "Název osy X nesmí být prázdný";
        error = true;
    }
    else if (!hasDate && xAxisLabel.length > 20) {
        helperTexts[HelperTextCodeEnum.X_AXIS_LABEL] = "Název osy X nesmí mít víc než 20 znaků";
        error = true;
    }
    else {
        helperTexts[HelperTextCodeEnum.X_AXIS_LABEL] = "";
    }
    if (unit.length > 5) {
        helperTexts[HelperTextCodeEnum.UNIT] = "Jednotka nesmí mít více než 5 znaků";
        error = true;
    }
    else {
        helperTexts[HelperTextCodeEnum.UNIT] = "";
    }
    if (error) {
        res.status(400).json({ message: "Předány nevalidní hodnoty", data: { helperTexts } });
        return;
    }
    try {
        const checkSportView = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_VIEW }); // TODO předělat na SPORT_VIEW
        const checkSportEdit = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT }); // TODO předělat na SPORT_VIEW
        if (checkSportView.status !== GenResEnum_1.GenEnum.SUCCESS && checkSportEdit.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkSportView.status).json({ message: checkSportView.message });
            return;
        }
        let userId = -1;
        if (checkSportView.status === GenResEnum_1.GenEnum.SUCCESS) {
            userId = checkSportView.data?.userId || -1;
        }
        else {
            userId = checkSportEdit.data?.userId || -1;
        }
        let highestOrderNumber = 0;
        const resHighestDefaultOrderNumber = await (0, getHighestDefaultGraphsOrderNumberModNEW_1.getHighestDefaultGraphsOrderNumberModNEW)({ userId });
        const resHighestUserOrderNumber = await (0, getHighestGraphsOrderNumberMod_1.getHighestGraphsOrderNumberMod)({ userId });
        highestOrderNumber = resHighestDefaultOrderNumber.data?.highestOrderNumber + resHighestUserOrderNumber.data?.highestOrderNumber + 1;
        let dbResult;
        let defaultGraphOnId = undefined;
        if (createDefGraph) {
            dbResult = await (0, createDefaultGraphMod_1.createDefaultGraphMod)({ sportId, graphLabel, hasDate, xAxisLabel, yAxisLabel, unit, hasGoals });
            defaultGraphOnId = await (0, createDefaultGraphOrderNumberMod_1.createDefaultGraphOrderNumberMod)({ userId, graphId: dbResult.data?.graphId, highestOrderNumber });
        }
        else {
            dbResult = await (0, createGraphMod_1.createGraphMod)({ sportId, userId, graphLabel, orderNumber: highestOrderNumber, hasDate, xAxisLabel, yAxisLabel, unit, hasGoals });
        }
        res.status(dbResult.status).json({ message: dbResult.message, data: { graphId: dbResult.data?.graphId, defaultGraphOnId: defaultGraphOnId?.data?.defaultGraphOrderNumberId, orderNumber: highestOrderNumber } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.createGraphCont = createGraphCont;
//# sourceMappingURL=createGraphCont.js.map
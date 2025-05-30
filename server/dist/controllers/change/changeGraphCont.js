"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeGraphCont = void 0;
const changeGraphMod_1 = require("../../models/change/changeGraphMod");
const changeXAxisDateGraphValuesMod_1 = require("../../models/change/changeXAxisDateGraphValuesMod");
const deleteIsGoalOfGraphValuesMod_1 = require("../../models/delete/deleteIsGoalOfGraphValuesMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
var HelperTextCodeEnum;
(function (HelperTextCodeEnum) {
    HelperTextCodeEnum[HelperTextCodeEnum["GRAPH_LABEL"] = 1] = "GRAPH_LABEL";
    HelperTextCodeEnum[HelperTextCodeEnum["Y_AXIS_LABEL"] = 2] = "Y_AXIS_LABEL";
    HelperTextCodeEnum[HelperTextCodeEnum["X_AXIS_LABEL"] = 3] = "X_AXIS_LABEL";
    HelperTextCodeEnum[HelperTextCodeEnum["UNIT"] = 6] = "UNIT";
})(HelperTextCodeEnum || (HelperTextCodeEnum = {}));
const changeGraphCont = async (req, res) => {
    const { graphId, graphLabel, hasDate, xAxisLabel, yAxisLabel, unit, hasGoals, isDefGraph, changedHasDate } = req.body;
    if (!graphId || graphId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID grafu" });
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
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: graphId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.GRAPH_EDIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        let dbResult;
        dbResult = await (0, changeGraphMod_1.changeGraphMod)({ graphId, graphLabel, hasDate, xAxisLabel, yAxisLabel, unit, hasGoals, isDefGraph });
        if (dbResult.status === GenResEnum_1.GenEnum.SUCCESS) {
            if (changedHasDate) {
                const today = new Date();
                const formattedDate = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;
                console.log("Dnešní datum:", formattedDate);
                const resChange = await (0, changeXAxisDateGraphValuesMod_1.changeXAxisDateGraphValuesMod)({ graphId, formattedDate, isDefGraph });
                if (resChange.status === GenResEnum_1.GenEnum.FAILURE) {
                    res.status(resChange.status).json({ message: resChange.message });
                    return;
                }
            }
            if (!hasGoals) {
                const resDelete = await (0, deleteIsGoalOfGraphValuesMod_1.deleteIsGoalOfGraphValuesMod)({ graphId, isDefGraph });
                if (resDelete.status === GenResEnum_1.GenEnum.FAILURE) {
                    res.status(resDelete.status).json({ message: resDelete.message });
                    return;
                }
            }
        }
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeGraphCont = changeGraphCont;
//# sourceMappingURL=changeGraphCont.js.map
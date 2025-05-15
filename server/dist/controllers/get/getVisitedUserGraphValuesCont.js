"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitedUserGraphValuesCont = void 0;
const getGraphValuesMod_1 = require("../../models/get/getGraphValuesMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getVisitedUserGraphValuesCont = async (req, res) => {
    const { graphId, defaultGraph } = req.query;
    if (!graphId) {
        res.status(400).json({ message: "Nevalidní ID grafu" });
        return;
    }
    const graphIdNumber = Number(graphId);
    if (isNaN(graphIdNumber)) {
        res.status(400).json({ message: "ID grafu musí být číslo" });
        return;
    }
    else if (graphIdNumber < 1) {
        res.status(400).json({ message: "Nevalidní ID grafu" });
    }
    const defaultGraphBool = defaultGraph === "true";
    const visitedUserId = Number(req.query.visitedUserId);
    if (!visitedUserId || visitedUserId < 1) {
        res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: visitedUserId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.USER_VISIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const dbResDefGraphValues = await (0, getGraphValuesMod_1.getGraphValuesMod)({ graphId: graphIdNumber, defaultGraph: defaultGraphBool, userId: visitedUserId });
        let formattedValues = [];
        if (dbResDefGraphValues.status === GenResEnum_1.GenEnum.SUCCESS && dbResDefGraphValues.data) {
            dbResDefGraphValues.data.forEach((value) => {
                const newGraph = {
                    graphValueId: value.graph_value_id,
                    yAxisValue: value.y_axis_value,
                    xAxisValue: value.x_axis_value,
                    isGoal: value.is_goal ? true : false,
                    orderNumber: value.order_number,
                };
                formattedValues.push(newGraph);
            });
        }
        res.status(dbResDefGraphValues.status).json({ message: dbResDefGraphValues.message, data: formattedValues });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getVisitedUserGraphValuesCont = getVisitedUserGraphValuesCont;
//# sourceMappingURL=getVisitedUserGraphValuesCont.js.map
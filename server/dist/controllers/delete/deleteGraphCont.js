"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGraphCont = void 0;
const deleteAllGraphValuesMod_1 = require("../../models/delete/deleteAllGraphValuesMod");
const deleteDefGraphOrderNumbersMod_1 = require("../../models/delete/deleteDefGraphOrderNumbersMod");
const deleteGraphMod_1 = require("../../models/delete/deleteGraphMod");
const getAllDefGraphOrderNumbersMod_1 = require("../../models/get/getAllDefGraphOrderNumbersMod");
const reorderGraphsMod_1 = require("../../models/move/reorderGraphsMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const deleteGraphCont = async (req, res) => {
    const { graphId, sportId, isDefGraph, orderNumber } = req.body;
    if (!graphId || graphId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID grafu" });
        return;
    }
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: graphId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.GRAPH_EDIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS && checkRes.data) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        let resDefGraphOrderNumbers = null;
        if (isDefGraph)
            resDefGraphOrderNumbers = await (0, getAllDefGraphOrderNumbersMod_1.getAllDefGraphOrderNumbersMod)({ graphId });
        const dbResult = await (0, deleteGraphMod_1.deleteGraphMod)({ graphId, isDefGraph });
        if (dbResult.status === GenResEnum_1.GenEnum.SUCCESS) {
            (0, deleteAllGraphValuesMod_1.deleteAllGraphValuesMod)({ graphId, isDefGraph });
            if (isDefGraph) {
                (0, deleteDefGraphOrderNumbersMod_1.deleteDefGraphOrderNumbersMod)({ graphId });
                if (resDefGraphOrderNumbers) {
                    resDefGraphOrderNumbers.data?.forEach((graph) => {
                        if (graph.order_number !== 0) {
                            (0, reorderGraphsMod_1.reorderGraphsMod)({ orderNumber: graph.order_number, userId: graph.user_id });
                        }
                    });
                }
            }
            else {
                (0, reorderGraphsMod_1.reorderGraphsMod)({ orderNumber, userId: checkRes.data?.userId });
            }
        }
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.deleteGraphCont = deleteGraphCont;
//# sourceMappingURL=deleteGraphCont.js.map
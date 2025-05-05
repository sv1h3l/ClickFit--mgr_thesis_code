"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGraphValueCont = void 0;
const deleteGraphValueMod_1 = require("../../models/delete/deleteGraphValueMod");
const reorderGraphValuesMod_1 = require("../../models/move/reorderGraphValuesMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteGraphValueCont = async (req, res) => {
    const { graphId, graphValueId, orderNumber } = req.body;
    if (!graphId || graphId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID grafu" });
        return;
    }
    if (!graphValueId || graphValueId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID hodnoty grafu" });
        return;
    }
    try {
        /* FIXME předělat to, jestli uživatel může přidat hodnotu.

        const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }*/
        const dbResult = await (0, deleteGraphValueMod_1.deleteGraphValueMod)({ graphValueId });
        if (dbResult.status === GenResEnum_1.GenEnum.SUCCESS) {
            (0, reorderGraphValuesMod_1.reorderGraphValuesMod)({ graphId, orderNumber });
        }
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.deleteGraphValueCont = deleteGraphValueCont;
//# sourceMappingURL=deleteGraphValueCont.js.map
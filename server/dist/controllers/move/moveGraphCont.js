"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveGraphCont = void 0;
const moveDefGraphMod_1 = require("../../models/move/moveDefGraphMod");
const moveGraphMod_1 = require("../../models/move/moveGraphMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const moveGraphCont = async (req, res) => {
    const { primaryGraphId, secondaryGraphId, moveUp, isPrimaryGraphDef, isSecondaryGraphDef } = req.body;
    if (!primaryGraphId || primaryGraphId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID primárního grafu" });
        return;
    }
    if (!secondaryGraphId || secondaryGraphId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sekundárního grafu" });
        return;
    }
    try {
        /* FIXME předělat to, jestli uživatel může změnit hodnotu.

        const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }*/
        let movePrimaryGraph;
        if (isPrimaryGraphDef) {
            movePrimaryGraph = await (0, moveDefGraphMod_1.moveDefGraphMod)({ graphId: primaryGraphId, orderNumber: moveUp ? -1 : 1 });
        }
        else {
            movePrimaryGraph = await (0, moveGraphMod_1.moveGraphMod)({ graphId: primaryGraphId, orderNumber: moveUp ? -1 : 1 });
        }
        let moveSecondaryGraph;
        if (isSecondaryGraphDef) {
            moveSecondaryGraph = await (0, moveDefGraphMod_1.moveDefGraphMod)({ graphId: secondaryGraphId, orderNumber: moveUp ? 1 : -1 });
        }
        else {
            moveSecondaryGraph = await (0, moveGraphMod_1.moveGraphMod)({ graphId: secondaryGraphId, orderNumber: moveUp ? 1 : -1 });
        }
        if (movePrimaryGraph.status === GenResEnum_1.GenEnum.FAILURE || moveSecondaryGraph.status === GenResEnum_1.GenEnum.FAILURE) {
            res.status(GenResEnum_1.GenEnum.FAILURE).json({ message: " Nastala chyba během změny pořadí grafů" });
        }
        res.status(GenResEnum_1.GenEnum.SUCCESS).json({ message: "Pořadí grafů úspěšně změněno" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.moveGraphCont = moveGraphCont;
//# sourceMappingURL=moveGraphCont.js.map
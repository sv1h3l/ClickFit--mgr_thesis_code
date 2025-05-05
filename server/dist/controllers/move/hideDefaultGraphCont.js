"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideDefaultGraphCont = void 0;
const hideDefGraphMod_1 = require("../../models/move/hideDefGraphMod");
const hideDefaultGraphCont = async (req, res) => {
    const { defGraphId, sportId, orderNumber } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (!defGraphId || defGraphId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID výchozího grafu" });
        return;
    }
    try {
        /* FIXME předělat to, jestli uživatel může změnit hodnotu.

        const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }*/
        const resHideDefGraph = await (0, hideDefGraphMod_1.hideDefGraphMod)({ defGraphId, sportId, orderNumber });
        res.status(resHideDefGraph.status).json({ message: resHideDefGraph.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.hideDefaultGraphCont = hideDefaultGraphCont;
//# sourceMappingURL=hideDefaultGraphCont.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showDefaultGraphCont = void 0;
const showDefGraphMod_1 = require("../../models/move/showDefGraphMod");
const showDefaultGraphCont = async (req, res) => {
    const { defGraphId, orderNumber } = req.body;
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
        const resHideDefGraph = await (0, showDefGraphMod_1.showDefGraphMod)({ defGraphId, orderNumber });
        res.status(resHideDefGraph.status).json({ message: resHideDefGraph.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.showDefaultGraphCont = showDefaultGraphCont;
//# sourceMappingURL=showDefaultGraphCont.js.map
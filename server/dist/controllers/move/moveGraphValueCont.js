"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveGraphValueCont = void 0;
const moveGraphValueMod_1 = require("../../models/move/moveGraphValueMod");
const moveGraphValueCont = async (req, res) => {
    const { primaryGraphValueId, secondaryGraphValueId, moveUp } = req.body;
    if (!primaryGraphValueId || primaryGraphValueId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID primárního záznamu grafu" });
        return;
    }
    if (!secondaryGraphValueId || secondaryGraphValueId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sekundárního záznamu grafu" });
        return;
    }
    try {
        /* FIXME předělat to, jestli uživatel může změnit hodnotu.

        const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }*/
        const dbResult = await (0, moveGraphValueMod_1.moveGraphValueMod)({ firstGraphValueId: moveUp ? primaryGraphValueId : secondaryGraphValueId, secondGraphValueId: moveUp ? secondaryGraphValueId : primaryGraphValueId });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.moveGraphValueCont = moveGraphValueCont;
//# sourceMappingURL=moveGraphValueCont.js.map
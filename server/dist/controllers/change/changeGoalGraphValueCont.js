"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeGoalGraphValueCont = void 0;
const changeGoalGraphValueMod_1 = require("../../models/change/changeGoalGraphValueMod");
const changeGoalGraphValueCont = async (req, res) => {
    const { graphValueId, isGoal } = req.body;
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
        const dbResult = await (0, changeGoalGraphValueMod_1.changeGoalGraphValueMod)({ graphValueId, isGoal });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeGoalGraphValueCont = changeGoalGraphValueCont;
//# sourceMappingURL=changeGoalGraphValueCont.js.map
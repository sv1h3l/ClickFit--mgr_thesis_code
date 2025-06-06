"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeGraphValueCont = void 0;
const changeGraphValueMod_1 = require("../../models/change/changeGraphValueMod");
const changeGraphValueCont = async (req, res) => {
    const { graphValueId, yAxisValue, xAxisValue, isDefaultGraphValue } = req.body;
    if (!graphValueId || graphValueId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID hodnoty grafu" });
        return;
    }
    if (!yAxisValue || !xAxisValue) {
        res.status(400).json({ message: "Hodnoty nesmí být prázdné" });
        return;
    }
    try {
        /* FIXME předělat to, jestli uživatel může přidat hodnotu.

        const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }*/
        /* TODO udělat to i pro default grafy */
        const dbResult = await (0, changeGraphValueMod_1.changeGraphValueMod)({ graphValueId, yAxisValue, xAxisValue });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeGraphValueCont = changeGraphValueCont;
//# sourceMappingURL=changeGraphValueCont.js.map
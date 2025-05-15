"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDifficultiesCont = void 0;
const getDifficultiesMod_1 = require("../../models/get/getDifficultiesMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getDifficultiesCont = async (req, res) => {
    const { sportId } = req.query;
    if (!sportId) {
        res.status(400).json({ message: "Chybějící ID sportu", data: [] });
        return;
    }
    const sportIdNumber = Number(sportId);
    if (isNaN(sportIdNumber)) {
        res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
        return;
    }
    const authToken = req.headers["authorization"]?.split(" ")[1];
    const checkResView = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportIdNumber, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_VIEW, authToken: authToken ? authToken : undefined });
    const checkResEdit = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportIdNumber, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT, authToken: authToken ? authToken : undefined });
    if (checkResView.status !== GenResEnum_1.GenEnum.SUCCESS && checkResEdit.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkResView.status).json({ message: checkResView.message });
        return;
    }
    try {
        const dbRes = await (0, getDifficultiesMod_1.getDifficultiesMod)({ sportId: sportIdNumber });
        let difficulties;
        if (dbRes.data && dbRes.data.length > 0) {
            difficulties = dbRes.data
                .map((difficulty) => ({
                sportDifficultyId: difficulty.sport_difficulty_id,
                difficultyName: difficulty.difficulty_name,
                orderNumber: difficulty.order_number,
            }))
                .sort((a, b) => a.orderNumber - b.orderNumber);
        }
        res.status(dbRes.status).json({ message: dbRes.message, data: difficulties });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getDifficultiesCont = getDifficultiesCont;
//# sourceMappingURL=getDifficultiesCont.js.map
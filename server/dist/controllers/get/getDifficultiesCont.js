"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDifficultiesCont = void 0;
const getDifficultiesMod_1 = require("../../models/get/getDifficultiesMod");
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
    /* TODO
    const checkRes = await checkAuthorizationController(req, sportIdNumber, CheckAuthorizationCodeEnum.SPORT_VIEW);
    if (!checkRes.authorized) {
        res.status(401).json({ message: checkRes.message });
    }*/
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
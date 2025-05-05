"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSportCont = void 0;
const createDefaultDetailLabelsMod_1 = require("../../models/create/createDefaultDetailLabelsMod");
const createResidueCategoryMod_1 = require("../../models/create/createResidueCategoryMod");
const createSportMod_1 = require("../../models/create/createSportMod");
const createUnassignedDifficultyMod_1 = require("../../models/create/createUnassignedDifficultyMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const getUserNameFromIdMod_1 = require("../../models/get/getUserNameFromIdMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createSportCont = async (req, res) => {
    const { sportName } = req.body;
    if (!sportName) {
        res.status(400).json({ message: "Název sportu nesmí být prázdný" });
        return;
    }
    const dbUserAtr = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req });
    if (dbUserAtr.status === GenResEnum_1.GenEnum.FAILURE || !dbUserAtr.data) {
        res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
        return;
    }
    try {
        const dbRes = await (0, createSportMod_1.createSportMod)(dbUserAtr.data.userId, sportName);
        if (dbRes.status === GenResEnum_1.GenEnum.SUCCESS && dbRes.data?.sportId) {
            (0, createResidueCategoryMod_1.createResidueCategoryMod)(dbRes.data.sportId);
            (0, createDefaultDetailLabelsMod_1.createDefaultDetailLabelsMod)(dbRes.data.sportId);
            (0, createUnassignedDifficultyMod_1.createDefaultDifficultiesMod)(dbRes.data.sportId);
            const userName = await (0, getUserNameFromIdMod_1.getUserNameFromIdMod)(dbUserAtr.data.userId);
            res.status(dbRes.status).json({
                message: dbRes.message,
                data: {
                    sportId: dbRes.data.sportId,
                    userName: userName,
                    userEmail: dbUserAtr.data.userEmail,
                    userId: dbUserAtr.data.userId,
                },
            });
            return;
        }
        res.status(dbRes.status).json({
            message: dbRes.message,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
    }
};
exports.createSportCont = createSportCont;
//# sourceMappingURL=createSportCont.js.map
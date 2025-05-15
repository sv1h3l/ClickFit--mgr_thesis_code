"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSharedSportCont = void 0;
const changeSharedSportMod_1 = require("../../models/change/changeSharedSportMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeSharedSportCont = async (req, res) => {
    const { sportId, userId, sportIsShared } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    if (!userId || userId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID uživatele." });
        return;
    }
    try {
        const dbUserAtr = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req });
        if (dbUserAtr.status === GenResEnum_1.GenEnum.FAILURE || !dbUserAtr.data) {
            res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
            return;
        }
        const dbResult = await (0, changeSharedSportMod_1.changeSharedSportMod)({ sportId, userId, sportIsShared, authorId: dbUserAtr.data.userId });
        res.status(dbResult.status).json({ message: dbResult.message, data: dbResult.data?.sharedSportId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeSharedSportCont = changeSharedSportCont;
//# sourceMappingURL=changeSharedSportCont.js.map
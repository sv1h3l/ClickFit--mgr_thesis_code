"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedSportsCont = void 0;
const getSharedSportsMod_1 = require("../../models/get/getSharedSportsMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getSharedSportsCont = async (req, res) => {
    const userId = Number(req.query.visitedUserId);
    const authToken = req.headers["authorization"]?.split(" ")[1];
    if (!authToken) {
        res.status(400).json({ message: "Chybějící token" });
        return;
    }
    if (!userId || userId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
        return;
    }
    const dbUserAtr = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req, authToken });
    if (dbUserAtr.status === GenResEnum_1.GenEnum.FAILURE || !dbUserAtr.data) {
        res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
        return;
    }
    try {
        const sports = await (0, getSharedSportsMod_1.getSharedSportsMod)({ authorId: dbUserAtr.data.userId, userId });
        if (sports.length > 0) {
            const formattedSports = sports.map((sport) => ({
                sharedSportId: sport.shared_sport_id,
                sportId: sport.sport_id,
                authorId: sport.author_id,
                userId: sport.user_id,
            }));
            res.status(200).json({ message: "Sdílené sporty úspěšně předány.", data: formattedSports });
        }
        else {
            res.status(200).json({ message: "Žádné sdílené sporty nenalezeny." });
        }
    }
    catch (error) {
        console.error("Chyba při získání sdílených sportů: ", error);
        res.status(500).json({ message: "Chyba při získání sdílených sportů." });
    }
};
exports.getSharedSportsCont = getSharedSportsCont;
//# sourceMappingURL=getSharedSportsCont.js.map
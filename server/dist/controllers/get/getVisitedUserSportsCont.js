"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitedUserSportsCont = void 0;
const getSportsMod_1 = require("../../models/get/getSportsMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getVisitedUserSportsCont = async (req, res) => {
    const authToken = req.headers["authorization"]?.split(" ")[1];
    if (!authToken) {
        res.status(400).json({ message: "Chybějící token" });
        return;
    }
    const visitedUserId = Number(req.query.visitedUserId);
    if (!visitedUserId || visitedUserId < 1) {
        res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, authToken, id: visitedUserId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.USER_VISIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const sports = await (0, getSportsMod_1.getSportsMod)(visitedUserId); // Získáme sporty
        if (sports.length > 0) {
            // Mapujeme sport z databázového formátu (snake_case) na formát camelCase
            const formattedSports = sports.map((sport) => ({
                userId: sport.user_id,
                userEmail: "",
                userName: sport.first_name + " " + sport.last_name,
                canUserEdit: sport.user_id === visitedUserId,
                sportId: sport.sport_id,
                sportName: sport.sport_name,
                hasCategories: sport.has_categories,
                hasDifficulties: sport.has_difficulties,
                hasRecommendedValues: sport.has_recommended_values,
                hasRecommendedDifficultyValues: sport.has_recommended_difficulty_values,
                hasAutomaticPlanCreation: sport.has_automatic_plan_creation,
                unitCode: sport.unit_code,
                description: sport.description,
            }));
            res.status(200).json({ message: "Sporty úspěšně předány.", data: formattedSports });
        }
        else {
            res.status(200).json({ message: "Žádné sporty nenalezeny.", data: [] });
        }
    }
    catch (error) {
        console.error("Chyba při získání sportů: ", error);
        res.status(500).json({ message: "Chyba při získání sportů.", data: [] });
    }
};
exports.getVisitedUserSportsCont = getVisitedUserSportsCont;
//# sourceMappingURL=getVisitedUserSportsCont.js.map
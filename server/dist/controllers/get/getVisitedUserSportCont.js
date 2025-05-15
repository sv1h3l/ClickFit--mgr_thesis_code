"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitedUserSportCont = void 0;
const getSportMod_1 = require("../../models/get/getSportMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getVisitedUserSportCont = async (req, res) => {
    const { sportId } = req.query;
    const authToken = req.headers["authorization"]?.split(" ")[1];
    if (!authToken) {
        res.status(400).json({ message: "Chybějící token", data: [] });
        return;
    }
    const sportIdNumber = Number(sportId);
    if (isNaN(sportIdNumber)) {
        res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
        return;
    }
    const visitedUserId = Number(req.query.visitedUserId);
    if (!visitedUserId || visitedUserId < 1) {
        res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, authToken, id: visitedUserId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.USER_VISIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const dbResSport = await (0, getSportMod_1.getSportMod)({ sportId: sportIdNumber });
        const formattedSport = {
            userId: dbResSport.data?.user_id,
            userEmail: "",
            userName: "",
            canUserEdit: false,
            sportId: dbResSport.data?.sport_id,
            sportName: dbResSport.data?.sport_name,
            hasCategories: dbResSport.data?.has_categories,
            hasDifficulties: dbResSport.data?.has_difficulties,
            hasRecommendedValues: dbResSport.data?.has_recommended_values,
            hasRecommendedDifficultyValues: dbResSport.data?.has_recommended_difficulty_values,
            hasAutomaticPlanCreation: dbResSport.data?.has_automatic_plan_creation,
            unitCode: dbResSport.data?.unit_code,
            description: dbResSport.data?.description,
        };
        res.status(dbResSport.status).json({ message: dbResSport.message, data: formattedSport });
    }
    catch (error) {
        console.error("Chyba při získání sportů: ", error);
        res.status(500).json({ message: "Chyba při získání sportů.", data: [] });
    }
};
exports.getVisitedUserSportCont = getVisitedUserSportCont;
//# sourceMappingURL=getVisitedUserSportCont.js.map
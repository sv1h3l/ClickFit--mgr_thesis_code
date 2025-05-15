"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitedUserDiaryCont = void 0;
const createDiaryMod_1 = require("../../models/create/createDiaryMod");
const getDiaryMod_1 = require("../../models/get/getDiaryMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getVisitedUserDiaryCont = async (req, res) => {
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
    const visitedUserId = Number(req.query.visitedUserId);
    if (!visitedUserId || visitedUserId < 1) {
        res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: visitedUserId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.USER_VISIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const dbGetDiaryRes = await (0, getDiaryMod_1.getDiaryMod)({ sportId: sportIdNumber, userId: visitedUserId });
        let formattedDiary;
        if (dbGetDiaryRes.status === GenResEnum_1.GenEnum.SUCCESS && dbGetDiaryRes.data) {
            formattedDiary = {
                diaryId: dbGetDiaryRes.data.diary_id,
                sportId: sportId,
                content: dbGetDiaryRes.data.content,
            };
        }
        else if (dbGetDiaryRes.status === GenResEnum_1.GenEnum.NOT_FOUND) {
            const dbCreateDiaryRes = await (0, createDiaryMod_1.createDiaryMod)({ sportId: sportIdNumber, userId: visitedUserId });
            if (dbCreateDiaryRes.status === GenResEnum_1.GenEnum.SUCCESS && dbCreateDiaryRes.data)
                formattedDiary = {
                    diaryId: dbCreateDiaryRes.data.diary_id,
                    sportId: sportId,
                    content: "",
                };
            res.status(dbCreateDiaryRes.status).json({ message: dbCreateDiaryRes.message, data: formattedDiary });
            return;
        }
        res.status(dbGetDiaryRes.status).json({ message: dbGetDiaryRes.message, data: formattedDiary });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getVisitedUserDiaryCont = getVisitedUserDiaryCont;
//# sourceMappingURL=getVisitedUserDiaryCont.js.map
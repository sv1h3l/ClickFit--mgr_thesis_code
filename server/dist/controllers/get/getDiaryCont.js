"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiaryCont = void 0;
const getDiaryMod_1 = require("../../models/get/getDiaryMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createDiaryMod_1 = require("../../models/create/createDiaryMod");
const getDiaryCont = async (req, res) => {
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
        const userAtrs = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req });
        if (userAtrs.status !== GenResEnum_1.GenEnum.SUCCESS || !userAtrs.data) {
            res.status(userAtrs.status).json({ message: userAtrs.message });
            return;
        }
        const dbGetDiaryRes = await (0, getDiaryMod_1.getDiaryMod)({ sportId: sportIdNumber, userId: userAtrs.data.userId });
        let formattedDiary;
        if (dbGetDiaryRes.status === GenResEnum_1.GenEnum.SUCCESS && dbGetDiaryRes.data) {
            formattedDiary = {
                diaryId: dbGetDiaryRes.data.diary_id,
                sportId: sportId,
                content: dbGetDiaryRes.data.content,
            };
        }
        else if (dbGetDiaryRes.status === GenResEnum_1.GenEnum.NOT_FOUND) {
            const dbCreateDiaryRes = await (0, createDiaryMod_1.createDiaryMod)({ sportId: sportIdNumber, userId: userAtrs.data.userId });
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
exports.getDiaryCont = getDiaryCont;
//# sourceMappingURL=getDiaryCont.js.map
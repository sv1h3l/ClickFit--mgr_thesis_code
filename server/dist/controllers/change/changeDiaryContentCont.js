"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDiaryContentCont = void 0;
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const changeDiaryContentMod_1 = require("../../models/change/changeDiaryContentMod");
const changeDiaryContentCont = async (req, res) => {
    const { diaryId, content } = req.body;
    if (!diaryId || diaryId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID deníku." });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: diaryId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.DIARY_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbResult = await (0, changeDiaryContentMod_1.changeDiaryContentMod)({ diaryId, content });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeDiaryContentCont = changeDiaryContentCont;
//# sourceMappingURL=changeDiaryContentCont.js.map
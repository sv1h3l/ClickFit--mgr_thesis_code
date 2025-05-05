"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeYoutubeLinkCont = void 0;
const changeYoutubeLinkMod_1 = require("../../models/change/changeYoutubeLinkMod");
const changeYoutubeLinkCont = async (req, res) => {
    const { sportId, exerciseId, youtubeLink } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    if (!exerciseId || exerciseId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID cviku." });
        return;
    }
    try {
        const dbResult = await (0, changeYoutubeLinkMod_1.changeYoutubeLinkMod)({ sportId, exerciseId, youtubeLink });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeYoutubeLinkCont = changeYoutubeLinkCont;
//# sourceMappingURL=changeYoutubeLinkCont.js.map
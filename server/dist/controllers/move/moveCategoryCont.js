"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveCategoryCont = void 0;
const GenResEnum_1 = require("../../utilities/GenResEnum");
const reorderCategoriesMod_1 = require("../../models/move/reorderCategoriesMod");
const moveCategoryCont = async (req, res) => {
    const { sportId, reorderCategories } = req.body;
    if (!sportId) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    if (reorderCategories.length < 1) {
        res.status(400).json({ message: "Nebyly předány kategorie pro přeuspořádání" });
        return;
    }
    try {
        const dbReorderResult = await (0, reorderCategoriesMod_1.reorderCategoriesMod)({ props: { sportId, reorderCategories } });
        switch (dbReorderResult.status) {
            case GenResEnum_1.GenEnum.SUCCESS:
                res.status(201).json({
                    message: "Kategorie byly úspěšně přeuspořádány",
                });
                break;
            default:
                console.error(dbReorderResult.message);
                res.status(500).json({ message: "Nastala chyba během přeuspořádávání kategorií" });
                break;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.moveCategoryCont = moveCategoryCont;
//# sourceMappingURL=moveCategoryCont.js.map
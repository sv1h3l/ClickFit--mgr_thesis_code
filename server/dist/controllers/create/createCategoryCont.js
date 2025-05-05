"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryCont = void 0;
const createCategoryMod_1 = require("../../models/create/createCategoryMod");
const incrementCategoriesOrderNumberMod_1 = require("../../models/move/incrementCategoriesOrderNumberMod");
const createCategoryCont = async (req, res) => {
    const { sportId, categoryName } = req.body;
    if (!categoryName) {
        res.status(400).json({ message: "Název kategorie nesmí být prázdný" });
        return;
    }
    if (!sportId) {
        res.status(400).json({ message: "Předáno nevalidní ID." });
        return;
    }
    try {
        const dbRes = await (0, createCategoryMod_1.createCategoryMod)(sportId, categoryName);
        switch (dbRes.status) {
            case createCategoryMod_1.CategoryCreationStatus.SUCCESS:
                if (dbRes.categoryId) {
                    (0, incrementCategoriesOrderNumberMod_1.incrementCategoriesOrderNumberMod)({ props: { sportId, categoryId: dbRes.categoryId } });
                }
                res.status(201).json({
                    message: "Kategorie byla úspěšně vytvořena",
                    data: {
                        categoryId: dbRes.categoryId,
                    },
                });
                break;
            case createCategoryMod_1.CategoryCreationStatus.ALREADY_EXISTS:
                res.status(409).json({ message: "Kategorie s tímto názvem již existuje" });
                break;
            default:
                res.status(500).json({ message: "Neznámá chyba při vytváření kategorie" });
                break;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
    }
};
exports.createCategoryCont = createCategoryCont;
//# sourceMappingURL=createCategoryCont.js.map
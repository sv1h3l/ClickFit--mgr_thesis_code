"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCategoryNameMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeCategoryNameMod = async (props) => {
    try {
        const query = `
				UPDATE categories
				SET category_name = ?
				WHERE sport_id = ? AND category_id = ?
			`;
        await server_1.db.promise().query(query, [props.categoryName, props.sportId, props.categoryId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Název kategorie úspěšně změněn" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny názvu kategorie" };
    }
};
exports.changeCategoryNameMod = changeCategoryNameMod;
//# sourceMappingURL=changeCategoryNameMod.js.map
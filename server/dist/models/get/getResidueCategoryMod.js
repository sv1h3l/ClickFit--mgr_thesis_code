"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResidueCategoryMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getResidueCategoryMod = async ({ props }) => {
    try {
        const getResidueCategoryModelQuery = `
			SELECT category_id
			FROM categories
			WHERE sport_id = ? AND order_number = 0;
		`;
        const [rows] = await server_1.db.promise().query(getResidueCategoryModelQuery, [props.sportId]);
        const categoryId = rows[0].category_id;
        return { status: GenResEnum_1.GenEnum.SUCCESS, data: categoryId };
    }
    catch (error) {
        console.error("Database error: ", error);
        // Správný návratový status při chybě
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Chyba při získání ID kategorie 'Ostatní'" };
    }
};
exports.getResidueCategoryMod = getResidueCategoryMod;
//# sourceMappingURL=getResidueCategoryMod.js.map
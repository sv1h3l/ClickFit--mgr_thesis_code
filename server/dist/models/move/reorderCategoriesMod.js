"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderCategoriesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const reorderCategoriesMod = async ({ props }) => {
    try {
        props.reorderCategories.map(async (category) => {
            const query = `
				UPDATE categories
				SET order_number = ?
				WHERE sport_id = ? AND category_id = ?
			`;
            await server_1.db.promise().query(query, [category.orderNumber, props.sportId, category.categoryId]);
        });
        return { status: GenResEnum_1.GenEnum.SUCCESS };
    }
    catch (error) {
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Database error: " + error };
    }
};
exports.reorderCategoriesMod = reorderCategoriesMod;
//# sourceMappingURL=reorderCategoriesMod.js.map
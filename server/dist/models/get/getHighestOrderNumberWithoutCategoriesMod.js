"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHighestOrderNumberWithoutCategoriesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getHighestOrderNumberWithoutCategoriesMod = async (props) => {
    try {
        const getHighestOrderNumberWithoutCategoryQuery = `
			SELECT MAX(order_number_without_categories) AS highest_order_number_without_categories
			FROM exercises
			WHERE sport_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(getHighestOrderNumberWithoutCategoryQuery, [props.sportId]);
        const highestOrderNumberWithoutCategory = rows[0].highest_order_number_without_categories === null ? 0 : rows[0].highest_order_number_without_categories;
        return { status: GenResEnum_1.GenEnum.SUCCESS, data: highestOrderNumberWithoutCategory + 1 };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Chyba při získání nejvyššího 'order_number_without_categories'" };
    }
};
exports.getHighestOrderNumberWithoutCategoriesMod = getHighestOrderNumberWithoutCategoriesMod;
//# sourceMappingURL=getHighestOrderNumberWithoutCategoriesMod.js.map
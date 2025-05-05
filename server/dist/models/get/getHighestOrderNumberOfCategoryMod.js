"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHighestOrderNumberOfCategoryMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getHighestOrderNumberOfCategoryMod = async ({ props }) => {
    try {
        const getHighestOrderNumberOfCategoryQuery = `
			SELECT MAX(order_number) AS highest_order_number
			FROM exercises
			WHERE sport_id = ? AND category_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(getHighestOrderNumberOfCategoryQuery, [props.sportId, props.categoryId]);
        // Oprava návratové hodnoty - pokud není žádný výsledek, vrátíme null
        const highestOrderNumber = rows[0].highest_order_number === null ? 0 : rows[0].highest_order_number;
        return { status: GenResEnum_1.GenEnum.SUCCESS, data: highestOrderNumber + 1 };
    }
    catch (error) {
        console.error("Database error: ", error);
        // Správný návratový status při chybě
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Chyba při získání nejvyššího 'order_number'" };
    }
};
exports.getHighestOrderNumberOfCategoryMod = getHighestOrderNumberOfCategoryMod;
//# sourceMappingURL=getHighestOrderNumberOfCategoryMod.js.map
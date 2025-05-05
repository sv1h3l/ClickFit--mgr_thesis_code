"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementCategoriesOrderNumberMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const incrementCategoriesOrderNumberMod = async ({ props }) => {
    try {
        // SQL dotaz pro zvýšení order_number u všech relevantních kategorií
        const query = `
			UPDATE categories
			SET order_number = order_number + 1
			WHERE sport_id = ? 
			AND category_id != ? 
			AND order_number > 0
		`;
        await server_1.db.promise().query(query, [props.sportId, props.categoryId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS };
    }
    catch (error) {
        console.error("Database error: ", error);
        return {
            status: GenResEnum_1.GenEnum.FAILURE,
            message: "Nastala chyba při zvyšování pořadí kategorií",
        };
    }
};
exports.incrementCategoriesOrderNumberMod = incrementCategoriesOrderNumberMod;
//# sourceMappingURL=incrementCategoriesOrderNumberMod.js.map
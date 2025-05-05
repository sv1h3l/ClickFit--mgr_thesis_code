"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderExercisesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const reorderExercisesMod = async (props) => {
    try {
        const orderNumberOfCategoryQuery = `
			UPDATE exercises
			SET order_number = order_number - 1
			WHERE sport_id = ? AND category_id = ? AND order_number > ?
		`;
        await server_1.db.promise().query(orderNumberOfCategoryQuery, [props.sportId, props.categoryId, props.orderNumber]);
        if (props.orderNumberWithoutCategories) {
            const orderNumberWithoutCategoriesQuery = `
				UPDATE exercises
				SET order_number_without_categories = order_number_without_categories - 1
				WHERE sport_id = ? AND order_number_without_categories > ?
			`;
            await server_1.db.promise().query(orderNumberWithoutCategoriesQuery, [props.sportId, props.orderNumberWithoutCategories]);
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během přeuspořádávání cviků" };
    }
};
exports.reorderExercisesMod = reorderExercisesMod;
//# sourceMappingURL=reorderExercisesMod.js.map
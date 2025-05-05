"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderTwoExercisesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const reorderTwoExercisesMod = async ({ props }) => {
    try {
        for (const exercise of props.reorderExercises) {
            const query = `
				UPDATE exercises
				SET ${props.hasCategories ? "order_number" : "order_number_without_categories"} = ?
				WHERE sport_id = ? AND exercise_id = ? 
			`;
            await server_1.db.promise().query(query, [exercise.orderNumber, props.sportId, exercise.exerciseId]);
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS };
    }
    catch (error) {
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Database error: " + error };
    }
};
exports.reorderTwoExercisesMod = reorderTwoExercisesMod;
//# sourceMappingURL=reorderTwoExercisesMod.js.map
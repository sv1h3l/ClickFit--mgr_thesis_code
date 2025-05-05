"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExerciseMod = exports.ExerciseCreationStatus = void 0;
const server_1 = require("../../server");
var ExerciseCreationStatus;
(function (ExerciseCreationStatus) {
    ExerciseCreationStatus[ExerciseCreationStatus["SUCCESS"] = 0] = "SUCCESS";
    ExerciseCreationStatus[ExerciseCreationStatus["ALREADY_EXISTS"] = 1] = "ALREADY_EXISTS";
    ExerciseCreationStatus[ExerciseCreationStatus["FAILURE"] = 2] = "FAILURE";
})(ExerciseCreationStatus || (exports.ExerciseCreationStatus = ExerciseCreationStatus = {}));
const createExerciseMod = async ({ props }) => {
    const checkQuery = `SELECT * FROM exercises WHERE sport_id = ? AND name = ? LIMIT 1`;
    try {
        const [existingCategory] = await server_1.db.promise().query(checkQuery, [props.sportId, props.exerciseName]);
        if (existingCategory.length > 0) {
            return { status: ExerciseCreationStatus.ALREADY_EXISTS };
        }
        const insertQuery = `
            INSERT INTO exercises (sport_id, name, order_number, order_number_without_categories, category_id, sport_difficulty_id, unit_code)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        // Perform the insert
        const [result] = await server_1.db.promise().query(insertQuery, [props.sportId, props.exerciseName, props.orderNumber, props.orderNumberWithoutCategories, props.categoryId, props.sportDifficultyId, props.unitCode]);
        const exerciseId = result.insertId;
        return { status: ExerciseCreationStatus.SUCCESS, exerciseId: exerciseId };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: ExerciseCreationStatus.FAILURE };
    }
};
exports.createExerciseMod = createExerciseMod;
//# sourceMappingURL=createExerciseMod.js.map
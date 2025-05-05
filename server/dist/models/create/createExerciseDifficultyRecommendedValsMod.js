"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExerciseDifficultyRecommendedValsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createExerciseDifficultyRecommendedValsMod = async (props) => {
    const checkQuery = `SELECT * FROM exercise_difficulties WHERE sport_difficulty_id = ? AND exercise_id = ? LIMIT 1`;
    try {
        const [existingDiffictuly] = await server_1.db.promise().query(checkQuery, [props.sportDifficultyId, props.exerciseId]);
        if (existingDiffictuly.length > 0) {
            return { status: GenResEnum_1.GenEnum.ALREADY_EXISTS, message: "Obtížnost cviku již existuje" };
        }
        const query = `
				INSERT INTO exercise_difficulties (sport_difficulty_id, exercise_id, series, repetitions, burden)
				VALUES (?, ?, ?, ?, ?)
			`;
        const [result] = await server_1.db.promise().query(query, [props.sportDifficultyId, props.exerciseId, props.series, props.repetitions, props.burden]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Obtížnost cviku úspěšně vytvořena", data: result.insertId };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření obtížnosti cviku" };
    }
};
exports.createExerciseDifficultyRecommendedValsMod = createExerciseDifficultyRecommendedValsMod;
//# sourceMappingURL=createExerciseDifficultyRecommendedValsMod.js.map
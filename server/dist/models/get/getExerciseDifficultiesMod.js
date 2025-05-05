"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseDifficultiesMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getExerciseDifficultiesMod = async (props) => {
    try {
        const query = `
			SELECT 
				exercise_difficulty_id,
				sport_difficulty_id,
				series,
				repetitions,
				burden
			FROM exercise_difficulties 
			WHERE exercise_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.exerciseId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Obtížnosti cviku úspěšně předány", data: rows };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání obtížností cviku" };
    }
};
exports.getExerciseDifficultiesMod = getExerciseDifficultiesMod;
//# sourceMappingURL=getExerciseDifficultiesMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExerciseDifficultiesMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getAllExerciseDifficultiesMod = async (props) => {
    try {
        const query = `
			SELECT 
				ed.exercise_difficulty_id,
				ed.sport_difficulty_id,
				ed.exercise_id,
				ed.series,
				ed.repetitions,
				ed.burden,
				sd.order_number
			FROM exercise_difficulties ed
			JOIN sport_difficulties sd ON ed.sport_difficulty_id = sd.sport_difficulty_id
			WHERE sd.sport_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Všechny obtížnosti cviků úspěšně předány", data: rows };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání všech obtížností cviků" };
    }
};
exports.getAllExerciseDifficultiesMod = getAllExerciseDifficultiesMod;
//# sourceMappingURL=getAllExerciseDifficultiesMod.js.map
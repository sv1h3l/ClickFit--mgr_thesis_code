"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeExerciseNameMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeExerciseNameMod = async (props) => {
    try {
        const query = `
				UPDATE exercises
				SET name = ?
				WHERE sport_id = ? AND exercise_id = ?
			`;
        await server_1.db.promise().query(query, [props.exerciseName, props.sportId, props.exerciseId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Název cviku úspěšně změněn" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny názvu cviku" };
    }
};
exports.changeExerciseNameMod = changeExerciseNameMod;
//# sourceMappingURL=changeExerciseNameMod.js.map
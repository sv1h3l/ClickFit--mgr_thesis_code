"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeExercisesDifficultyMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeExercisesDifficultyMod = async (props) => {
    try {
        const query = `
				UPDATE exercises
				SET sport_difficulty_id = ?
				WHERE sport_id = ? AND sport_difficulty_id = ?
			`;
        await server_1.db.promise().query(query, [props.newSportDifficultyId, props.sportId, props.sportDifficultyId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Obtížnost cviku úspěšně změněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny obtížnosti cviku" };
    }
};
exports.changeExercisesDifficultyMod = changeExercisesDifficultyMod;
//# sourceMappingURL=changeExercisesDifficultyMod.js.map
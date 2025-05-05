"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportDifficultyMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeSportDifficultyMod = async (props) => {
    try {
        const query = `
				UPDATE exercises
				SET sport_difficulty_id = ?
				WHERE sport_id = ? AND exercise_id = ?;
			`;
        await server_1.db.promise().query(query, [props.sportDifficultyId, props.sportId, props.exerciseId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Obtížnost cviku úspešně změněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny obtížnosti cviku" };
    }
};
exports.changeSportDifficultyMod = changeSportDifficultyMod;
//# sourceMappingURL=changeSportDifficultyMod.js.map
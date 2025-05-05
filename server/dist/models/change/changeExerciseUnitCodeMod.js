"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeExerciseUnitCodeMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeExerciseUnitCodeMod = async (props) => {
    try {
        const query = `
				UPDATE exercises
				SET unit_code = ?
				WHERE sport_id = ? AND exercise_id = ?
			`;
        await server_1.db.promise().query(query, [props.unitCode, props.sportId, props.exerciseId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Jednotka cviku úspěšně změněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny jednotky cviku" };
    }
};
exports.changeExerciseUnitCodeMod = changeExerciseUnitCodeMod;
//# sourceMappingURL=changeExerciseUnitCodeMod.js.map
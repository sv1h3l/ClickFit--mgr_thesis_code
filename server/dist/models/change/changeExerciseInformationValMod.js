"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeExerciseInformationValMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeExerciseInformationValMod = async (props) => {
    try {
        const query = `
				UPDATE exercise_information_values
				SET value = ?
				WHERE exercise_information_value_id = ?;
			`;
        await server_1.db.promise().query(query, [props.exerciseInformationValue, props.exerciseInformationValueId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Informace o cviku úspěšně změněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny informace o cviku" };
    }
};
exports.changeExerciseInformationValMod = changeExerciseInformationValMod;
//# sourceMappingURL=changeExerciseInformationValMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExerciseInformationValMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createExerciseInformationValMod = async (props) => {
    const checkQuery = `SELECT exercise_information_value_id FROM exercise_information_values
						WHERE exercise_information_labels_id = ? AND user_id = ? AND exercise_id = ?
						LIMIT 1`;
    try {
        const [exist] = await server_1.db.promise().query(checkQuery, [props.exerciseInformationLabelId, props.userId, props.exerciseId]);
        if (exist.length > 0) {
            return { status: GenResEnum_1.GenEnum.ALREADY_EXISTS, data: exist[0].exercise_information_value_id };
        }
        const query = `
				INSERT INTO exercise_information_values (exercise_information_labels_id, user_id, exercise_id, value)
				VALUES (?, ?, ?, ?)
			`;
        const [result] = await server_1.db.promise().query(query, [props.exerciseInformationLabelId, props.userId, props.exerciseId, props.exerciseInformationValue]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Informace o cviku úspěšně vytvořena", data: result.insertId };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření informace o cviku" };
    }
};
exports.createExerciseInformationValMod = createExerciseInformationValMod;
//# sourceMappingURL=createExerciseInformationValMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExerciseInformationLabMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createExerciseInformationLabMod = async ({ sportId, exerciseInformationLabel, orderNumber }) => {
    const checkQuery = `SELECT * FROM exercise_information_labels WHERE sport_id = ? AND label = ? LIMIT 1`;
    try {
        const [existingLabel] = await server_1.db.promise().query(checkQuery, [sportId, exerciseInformationLabel]);
        if (existingLabel.length > 0) {
            return { status: GenResEnum_1.GenEnum.ALREADY_EXISTS, message: "Informace o cviku stímto názvem již existuje" };
        }
        const query = `
				INSERT INTO exercise_information_labels (sport_id, label, order_number) 
				VALUES (?, ?, ?);
			`;
        const [result] = await server_1.db.promise().query(query, [sportId, exerciseInformationLabel, orderNumber]);
        const exerciseInformationLabelId = result.insertId; // FIXME je insertId správné ?
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Informace o cviku úspěšně vytvořena", data: exerciseInformationLabelId };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření informace o cviku" };
    }
};
exports.createExerciseInformationLabMod = createExerciseInformationLabMod;
//# sourceMappingURL=createExerciseInformationLabMod.js.map
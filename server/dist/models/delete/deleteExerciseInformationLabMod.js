"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExerciseInformationLabMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteExerciseInformationLabMod = async (props) => {
    try {
        const query = `
            DELETE FROM exercise_information_labels WHERE sport_id = ? AND exercise_information_labels_id = ?
        `;
        await server_1.db.promise().query(query, [props.sportId, props.exerciseInformationLabelId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Informace o cviku úspěšně odstraněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během odstraňování informace o cviku" };
    }
};
exports.deleteExerciseInformationLabMod = deleteExerciseInformationLabMod;
//# sourceMappingURL=deleteExerciseInformationLabMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExerciseInformationValsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteExerciseInformationValsMod = async (props) => {
    try {
        const query = `
            DELETE FROM exercise_information_values
			WHERE exercise_information_labels_id = ?
       	`;
        await server_1.db.promise().query(query, [props.exerciseInformationLabelId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Údaje informace o cviku úspěšně odstraněny" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během odstraňování hodnot informace o cviku" };
    }
};
exports.deleteExerciseInformationValsMod = deleteExerciseInformationValsMod;
//# sourceMappingURL=deleteExerciseInformationValsMod.js.map
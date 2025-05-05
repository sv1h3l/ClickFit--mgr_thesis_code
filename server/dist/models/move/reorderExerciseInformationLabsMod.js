"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderExerciseInformationLabsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const reorderExerciseInformationLabsMod = async (props) => {
    try {
        props.reorderExerciseInformationLabels.map(async (label) => {
            const query = `
				UPDATE exercise_information_labels
				SET order_number = ?
				WHERE sport_id = ? AND exercise_information_labels_id = ?
			`;
            await server_1.db.promise().query(query, [label.orderNumber, props.sportId, label.exerciseInformationLabelId]);
        });
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Informace o cviku úspěšně přeuspořádány" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během přeusporádávání informací o cviku" };
    }
};
exports.reorderExerciseInformationLabsMod = reorderExerciseInformationLabsMod;
//# sourceMappingURL=reorderExerciseInformationLabsMod.js.map
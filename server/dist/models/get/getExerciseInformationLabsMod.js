"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseInformationLabsMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const getExerciseInformationLabsMod = async (sportId) => {
    try {
        const query = `
			SELECT 
				exercise_information_labels_id,
				label,
				order_number
			FROM exercise_information_labels
			WHERE sport_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [sportId]);
        return rows; // Return the result as the proper type
    }
    catch (error) {
        console.error("Database error: ", error);
        return [];
    }
};
exports.getExerciseInformationLabsMod = getExerciseInformationLabsMod;
//# sourceMappingURL=getExerciseInformationLabsMod.js.map
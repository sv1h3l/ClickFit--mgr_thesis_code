"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseInformationValsMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const getExerciseInformationValsMod = async (sportId, exerciseId, userId) => {
    try {
        const query = `
			SELECT 
				eiv.exercise_information_labels_id,
				eiv.exercise_information_value_id,
				eiv.value,
				eil.sport_id
			FROM exercise_information_values eiv
			JOIN exercise_information_labels eil
				ON eiv.exercise_information_labels_id = eil.exercise_information_labels_id
			WHERE eil.sport_id = ? 
			AND eiv.exercise_id = ? 
			AND eiv.user_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [sportId, exerciseId, userId]);
        return rows;
    }
    catch (error) {
        console.error("Database error: ", error);
        return [];
    }
};
exports.getExerciseInformationValsMod = getExerciseInformationValsMod;
//# sourceMappingURL=getExerciseInformationValsMod.js.map
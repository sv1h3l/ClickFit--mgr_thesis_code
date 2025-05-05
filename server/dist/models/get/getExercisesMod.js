"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercisesMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const getExercisesMod = async (sportId) => {
    try {
        // JOIN sports table with users table to get first_name and last_name
        const getExercisesQuery = `
			SELECT *
			FROM exercises
			WHERE sport_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(getExercisesQuery, [sportId]);
        return rows; // Return the result as the proper type
    }
    catch (error) {
        console.error("Database error: ", error);
        return [];
    }
};
exports.getExercisesMod = getExercisesMod;
//# sourceMappingURL=getExercisesMod.js.map
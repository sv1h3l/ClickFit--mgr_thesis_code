"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesAndExercisesMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const getCategoriesAndExercisesMod = async (sportId) => {
    try {
        // JOIN sports table with users table to get first_name and last_name
        const getCategoriesQuery = `
			SELECT *
			FROM categories
			WHERE sport_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(getCategoriesQuery, [sportId]);
        return rows; // Return the result as the proper type
    }
    catch (error) {
        console.error("Database error: ", error);
        return [];
    }
};
exports.getCategoriesAndExercisesMod = getCategoriesAndExercisesMod;
//# sourceMappingURL=getCategoriesAndExercisesMod.js.map
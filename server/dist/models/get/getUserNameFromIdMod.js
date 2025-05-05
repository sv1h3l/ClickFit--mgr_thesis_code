"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserNameFromIdMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const getUserNameFromIdMod = async (userId) => {
    const query = `SELECT first_name, last_name FROM users WHERE user_id = ?`;
    try {
        const [results] = await server_1.db.promise().query(query, [userId]);
        if (results.length === 0) {
            console.error("User not found.");
            return ""; // FAILURE
        }
        return results[0].first_name + " " + results[0].last_name; // SUCCESS
    }
    catch (error) {
        console.error("Database error: ", error);
        return ""; // FAILURE
    }
};
exports.getUserNameFromIdMod = getUserNameFromIdMod;
//# sourceMappingURL=getUserNameFromIdMod.js.map
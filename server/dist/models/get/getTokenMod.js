"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const getTokenMod = async (email) => {
    const query = `
		SELECT token
		FROM users
		WHERE email = ?`;
    try {
        const [results] = await server_1.db.promise().query(query, [email]);
        if (results.length === 0) {
            console.error("Nebyl nazelezen účet s emailem:", email);
            return null;
        }
        return results[0].token;
    }
    catch (error) {
        console.error("Database error: ", error);
        return null;
    }
};
exports.getTokenMod = getTokenMod;
//# sourceMappingURL=getTokenMod.js.map
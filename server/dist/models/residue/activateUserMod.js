"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateUserMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const activateUserMod = async (token) => {
    const query = `
		UPDATE users
		SET is_active = 1
		WHERE token = ?`;
    try {
        const results = await new Promise((resolve, reject) => {
            server_1.db.query(query, [token], (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
        if (results.affectedRows === 0) {
            return false;
        }
        return true;
    }
    catch (error) {
        throw error;
    }
};
exports.activateUserMod = activateUserMod;
//# sourceMappingURL=activateUserMod.js.map
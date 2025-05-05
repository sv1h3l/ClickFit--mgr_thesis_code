"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTokenMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const deleteTokenMod = (token) => {
    return new Promise((resolve, reject) => {
        const query = `
			UPDATE users
			SET token = null, token_expires = null
			WHERE token = ?`;
        server_1.db.query(query, [token], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                const result = results; // Cast results to any to access affectedRows
                if (result.affectedRows === 0) {
                    resolve(null); // Token nebyl nalezen nebo byl neplatný
                }
                else {
                    resolve(true); // Úspěšné odstranění tokenu
                }
            }
        });
    });
};
exports.deleteTokenMod = deleteTokenMod;
//# sourceMappingURL=deleteTokenMod.js.map
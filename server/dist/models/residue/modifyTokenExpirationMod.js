"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyTokenExpirationMod = void 0;
const server_1 = require("../../server");
const modifyTokenExpirationMod = async (email) => {
    return new Promise((resolve, reject) => {
        const query = `
			UPDATE users
			SET token_expires = DATE_ADD(CURDATE(), INTERVAL 14 DAY)
			WHERE email = ?`;
        server_1.db.query(query, [email], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                const result = results;
                if (result.affectedRows === 0) {
                    resolve(null);
                }
                else {
                    resolve(true);
                }
            }
        });
    });
};
exports.modifyTokenExpirationMod = modifyTokenExpirationMod;
//# sourceMappingURL=modifyTokenExpirationMod.js.map
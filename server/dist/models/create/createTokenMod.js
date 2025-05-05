"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenMod = void 0;
const server_1 = require("../../server");
const generateToken_1 = require("../../utilities/generateToken");
const createTokenMod = async (email) => {
    const token = (0, generateToken_1.generateToken)();
    return new Promise((resolve, reject) => {
        const query = `
			UPDATE users
			SET token = ?, token_expires = NOW()
			WHERE email = ?`;
        server_1.db.query(query, [token, email], (error, results) => {
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
exports.createTokenMod = createTokenMod;
//# sourceMappingURL=createTokenMod.js.map
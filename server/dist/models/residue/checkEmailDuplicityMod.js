"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmailDuplicityMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
/** Kontrola duplicity emailu */
const checkEmailDuplicityMod = (email) => {
    return new Promise((resolve, reject) => {
        const query = `
			SELECT COUNT(*) as count FROM users WHERE email = ?
		`;
        server_1.db.query(query, [email], (error, results) => {
            if (error) {
                console.error("Check email dupicity error: ", error);
                reject(error);
            }
            else {
                const count = results[0]?.count || 0;
                resolve(count > 0); // Pokud je alespoň jeden záznam, tak je email duplicitní
            }
        });
    });
};
exports.checkEmailDuplicityMod = checkEmailDuplicityMod;
//# sourceMappingURL=checkEmailDuplicityMod.js.map
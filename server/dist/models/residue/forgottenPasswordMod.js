"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgottenPassword = exports.ForgottenPasswordStatus = void 0;
const server_1 = require("../../server"); // Import připojení k DB
var ForgottenPasswordStatus;
(function (ForgottenPasswordStatus) {
    ForgottenPasswordStatus[ForgottenPasswordStatus["ADD_TOKEN"] = 0] = "ADD_TOKEN";
    ForgottenPasswordStatus[ForgottenPasswordStatus["MODIFY_EXPIRATION"] = 1] = "MODIFY_EXPIRATION";
    ForgottenPasswordStatus[ForgottenPasswordStatus["NO_USER_FOUND"] = 2] = "NO_USER_FOUND";
    ForgottenPasswordStatus[ForgottenPasswordStatus["FAILURE"] = 3] = "FAILURE";
})(ForgottenPasswordStatus || (exports.ForgottenPasswordStatus = ForgottenPasswordStatus = {}));
const forgottenPassword = async (email) => {
    const query = `SELECT email, token FROM users WHERE email = ?`;
    try {
        const [results] = await server_1.db.promise().query(query, [email]);
        if (results.length === 0) {
            console.error("Není v databázi uživatel s emailem:", email);
            return ForgottenPasswordStatus.NO_USER_FOUND;
        }
        const user = results[0];
        if (user.token === null) {
            return ForgottenPasswordStatus.ADD_TOKEN;
        }
        else {
            return ForgottenPasswordStatus.MODIFY_EXPIRATION;
        }
    }
    catch (error) {
        console.error("Database error: ", error);
        return ForgottenPasswordStatus.FAILURE;
    }
};
exports.forgottenPassword = forgottenPassword;
//# sourceMappingURL=forgottenPasswordMod.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserMod = exports.LoginStatus = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const server_1 = require("../../server");
var LoginStatus;
(function (LoginStatus) {
    LoginStatus[LoginStatus["SUCCESS"] = 0] = "SUCCESS";
    LoginStatus[LoginStatus["FAILURE"] = 1] = "FAILURE";
    LoginStatus[LoginStatus["USER_INACTIVE"] = 2] = "USER_INACTIVE";
})(LoginStatus || (exports.LoginStatus = LoginStatus = {}));
const loginUserMod = async (email, password) => {
    const query = `SELECT email, hashed_password, is_active, auth_token FROM users WHERE email = ?`;
    try {
        const [results] = await server_1.db.promise().query(query, [email]);
        if (results.length === 0) {
            return { status: LoginStatus.FAILURE, authToken: null }; // Uživatel neexistuje
        }
        const user = results[0];
        if (user.is_active === 0) {
            return { status: LoginStatus.USER_INACTIVE, authToken: null }; // Účet není aktivní
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.hashed_password);
        if (!isPasswordValid) {
            return { status: LoginStatus.FAILURE, authToken: null }; // Neplatné heslo
        }
        return { status: LoginStatus.SUCCESS, authToken: user.auth_token };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: LoginStatus.FAILURE, authToken: null };
    }
};
exports.loginUserMod = loginUserMod;
//# sourceMappingURL=loginUserMod.js.map
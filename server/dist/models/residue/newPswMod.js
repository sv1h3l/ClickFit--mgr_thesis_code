"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPswMod = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const newPswMod = async (props) => {
    const query = `
		UPDATE users
		SET hashed_password = ?
		WHERE token = ?
		`;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(props.password, 10);
        await server_1.db.promise().query(query, [hashedPassword, props.token]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Heslo uživatele úspěšně změněno" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny hesla uživatele" };
    }
};
exports.newPswMod = newPswMod;
//# sourceMappingURL=newPswMod.js.map
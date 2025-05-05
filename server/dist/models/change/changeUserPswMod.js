"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserPswMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUserPswMod = async (props) => {
    try {
        const query = `
				UPDATE users
				SET hashed_password = ?
				WHERE user_id = ? AND email = ?
			`;
        await server_1.db.promise().query(query, [props.hashedPassword, props.userId, props.userEmail]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Heslo uživatele úspěšně změněno" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny hesla uživatele" };
    }
};
exports.changeUserPswMod = changeUserPswMod;
//# sourceMappingURL=changeUserPswMod.js.map
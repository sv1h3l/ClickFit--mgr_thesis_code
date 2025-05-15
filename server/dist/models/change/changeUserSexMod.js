"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserSexMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUserSexMod = async (props) => {
    try {
        const query = `
				UPDATE users
				SET sex = ?
				WHERE user_id = ? AND email = ?
			`;
        await server_1.db.promise().query(query, [props.value, props.userId, props.userEmail]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Pohlaví uživatele úspěšně změněno" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny pohlaví uživatele" };
    }
};
exports.changeUserSexMod = changeUserSexMod;
//# sourceMappingURL=changeUserSexMod.js.map
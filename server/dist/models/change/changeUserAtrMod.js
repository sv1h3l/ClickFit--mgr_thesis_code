"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserAtrMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUserAtrMod = async (props) => {
    try {
        const query = `
				UPDATE users
				SET ${props.column} = ?
				WHERE user_id = ? AND email = ?
			`;
        await server_1.db.promise().query(query, [props.value, props.userId, props.userEmail]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Údaj uživatele úspěšně změněn" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny údaje uživatele" };
    }
};
exports.changeUserAtrMod = changeUserAtrMod;
//# sourceMappingURL=changeUserAtrMod.js.map
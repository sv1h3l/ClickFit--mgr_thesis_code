"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserHealthMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUserHealthMod = async (props) => {
    try {
        const query = `
				UPDATE users
				SET health = ?
				WHERE user_id = ? AND email = ?
			`;
        await server_1.db.promise().query(query, [props.health, props.userId, props.userEmail]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Zdravotní údaje uživatele úspěšně změněny" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny zdravotních údajů uživatele" };
    }
};
exports.changeUserHealthMod = changeUserHealthMod;
//# sourceMappingURL=changeUserHealthMod.js.map
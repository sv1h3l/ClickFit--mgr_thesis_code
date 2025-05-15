"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserSettingsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUserSettingsMod = async (props) => {
    const query = `
		UPDATE users
		SET ${props.isTextSize ? "text_size_code" : "color_scheme_code"} = ?
		WHERE user_id = ?
	`;
    try {
        await server_1.db.promise().query(query, [props.code, props.userId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Nastavení uživatele úspěšně změněno" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny nastavení uživatele" };
    }
};
exports.changeUserSettingsMod = changeUserSettingsMod;
//# sourceMappingURL=changeUserSettingsMod.js.map
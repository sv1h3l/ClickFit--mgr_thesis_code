"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSettingsMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getUserSettingsMod = async (props) => {
    try {
        const query = `
			SELECT 
				color_scheme_code AS colorSchemeCode,
				text_size_code AS textSizeCode
			FROM users
			WHERE user_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.userId]);
        if (rows.length === 0) {
            return { status: GenResEnum_1.GenEnum.FAILURE, message: "Uživatel nebyl nalezen" };
        }
        const user = rows[0];
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Nastavení uživatele úspěšně předáno", data: user };
    }
    catch (error) {
        console.error("Chyba databáze: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během předávání nastavení uživatele" };
    }
};
exports.getUserSettingsMod = getUserSettingsMod;
//# sourceMappingURL=getUserSettingsMod.js.map
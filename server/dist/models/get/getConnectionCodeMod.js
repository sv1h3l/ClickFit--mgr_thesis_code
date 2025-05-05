"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionCodeMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getConnectionCodeMod = async (props) => {
    try {
        const getCCquery = `
			SELECT connection_code FROM users
			WHERE user_id = ? LIMIT 1;
		`;
        const [rows] = await server_1.db.promise().query(getCCquery, [props.userId]);
        if (rows.length > 0) {
            return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Kód spojení úspěšně nalezen", data: { connectionCode: rows[0].connection_code } };
        }
        else {
            return { status: GenResEnum_1.GenEnum.NOT_FOUND, message: "Kód spojení nebyl nalezen" };
        }
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání kódu spojení" };
    }
};
exports.getConnectionCodeMod = getConnectionCodeMod;
//# sourceMappingURL=getConnectionCodeMod.js.map
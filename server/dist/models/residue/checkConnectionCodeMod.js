"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConnectionCodeMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkConnectionCodeMod = async (props) => {
    const checkQuery = `
					SELECT user_id, first_name, last_name FROM users
					WHERE connection_code = ? LIMIT 1
				`;
    try {
        const [user] = await server_1.db.promise().query(checkQuery, [props.connectionCode]);
        if (user.length === 0) {
            return { status: GenResEnum_1.GenEnum.NOT_FOUND, message: "Uživatel s patřičným kódem spojení nebyl nalezen" };
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Uživatel s patřičným kódem spojení úspěšně předán", data: user[0] };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během hledání uživatele s patřičným kódem spojení" };
    }
};
exports.checkConnectionCodeMod = checkConnectionCodeMod;
//# sourceMappingURL=checkConnectionCodeMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserGraphsMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getUserGraphsMod = async (props) => {
    try {
        const query = `
			SELECT * FROM user_graphs
			WHERE sport_id = ? AND user_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.sportId, props.userId]);
        if (rows.length === 0) {
            return { status: GenResEnum_1.GenEnum.NOT_FOUND, message: "Uživatelské grafy nebyly nalezeny" };
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Uživatelské grafy úspěšně předány", data: rows };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání uživatelských grafů" };
    }
};
exports.getUserGraphsMod = getUserGraphsMod;
//# sourceMappingURL=getUserGraphsMod.js.map
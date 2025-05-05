"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultGraphsMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getDefaultGraphsMod = async (props) => {
    try {
        const query = `
			SELECT 
				*
			FROM default_graphs
			WHERE sport_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.sportId]);
        if (rows.length === 0) {
            return { status: GenResEnum_1.GenEnum.NOT_FOUND, message: "Výchozí grafy nebyly nalezeny" };
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Výchozí grafy úspěšně předány", data: rows };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání výchozích grafů" };
    }
};
exports.getDefaultGraphsMod = getDefaultGraphsMod;
//# sourceMappingURL=getDefaultGraphsMod.js.map
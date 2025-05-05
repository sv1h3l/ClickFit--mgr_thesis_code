"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGraphValuesMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getGraphValuesMod = async (props) => {
    try {
        const query = `
			SELECT * FROM graph_values
			WHERE graph_id = ? AND is_default_graph_value = ? AND user_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.graphId, props.defaultGraph, props.userId]);
        if (rows.length === 0) {
            return { status: GenResEnum_1.GenEnum.NOT_FOUND, message: "Hodnoty grafů nebyly nalezeny" };
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Hodnoty grafů úspěšně předány", data: rows };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání hodnot grafů" };
    }
};
exports.getGraphValuesMod = getGraphValuesMod;
//# sourceMappingURL=getGraphValuesMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDefGraphOrderNumbersMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getAllDefGraphOrderNumbersMod = async (props) => {
    try {
        const query = `
			SELECT * FROM default_graphs_order_numbers
			WHERE graph_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.graphId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Pořadí výchozího grafu úspěšně předáno", data: rows };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání pořádí výchozího grafu" };
    }
};
exports.getAllDefGraphOrderNumbersMod = getAllDefGraphOrderNumbersMod;
//# sourceMappingURL=getAllDefGraphOrderNumbersMod.js.map
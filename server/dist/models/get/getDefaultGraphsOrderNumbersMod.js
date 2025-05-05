"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultGraphOrderNumberMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getDefaultGraphOrderNumberMod = async (props) => {
    try {
        const query = `
			SELECT 
				default_graph_order_number_id,
				order_number
			FROM default_graphs_order_numbers
			WHERE user_id = ? AND graph_id = ? LIMIT 1;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.userId, props.graphId]);
        if (rows.length === 0) {
            return { status: GenResEnum_1.GenEnum.NOT_FOUND, message: "Pořadí výchozího grafu nebylo nalezeno" };
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Pořadí výchozího grafu úspěšně předáno", data: rows[0] };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání pořádí výchozího grafu" };
    }
};
exports.getDefaultGraphOrderNumberMod = getDefaultGraphOrderNumberMod;
//# sourceMappingURL=getDefaultGraphsOrderNumbersMod.js.map
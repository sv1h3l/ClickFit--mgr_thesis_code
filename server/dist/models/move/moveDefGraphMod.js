"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveDefGraphMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const moveDefGraphMod = async (props) => {
    try {
        const firstQuery = `
				UPDATE default_graphs_order_numbers
				SET order_number = order_number + ?
				WHERE default_graph_order_number_id = ?
			`;
        server_1.db.promise().query(firstQuery, [props.orderNumber, props.graphId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Pořadí výchozího grafu úspěšně změněno" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny pořadí výchozího grafu" };
    }
};
exports.moveDefGraphMod = moveDefGraphMod;
//# sourceMappingURL=moveDefGraphMod.js.map
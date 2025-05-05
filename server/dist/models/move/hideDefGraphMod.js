"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideDefGraphMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const hideDefGraphMod = async (props) => {
    try {
        const hideQuery = `
				UPDATE default_graphs_order_numbers
				SET order_number = 0
				WHERE default_graph_order_number_id = ?
			`;
        await server_1.db.promise().query(hideQuery, [props.defGraphId]);
        const reorderGraphsQuery = `
				UPDATE user_graphs
				SET order_number = order_number - 1
				WHERE sport_id = ? AND order_number > ?
			`;
        await server_1.db.promise().query(reorderGraphsQuery, [props.sportId, props.orderNumber]);
        const reorderDefGraphsQuery = `
				UPDATE default_graphs_order_numbers dgo
				JOIN default_graphs dg ON dgo.graph_id = dg.graph_id
				SET dgo.order_number = dgo.order_number - 1
				WHERE dg.sport_id = ? AND dgo.order_number > ?;
			`;
        await server_1.db.promise().query(reorderDefGraphsQuery, [props.sportId, props.orderNumber]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Výchozí graf úspěšně skryt" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během skrytí výchozího grafu" };
    }
};
exports.hideDefGraphMod = hideDefGraphMod;
//# sourceMappingURL=hideDefGraphMod.js.map
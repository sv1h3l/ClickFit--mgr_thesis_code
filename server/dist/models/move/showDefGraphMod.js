"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showDefGraphMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const showDefGraphMod = async (props) => {
    try {
        const query = `
				UPDATE default_graphs_order_numbers
				SET order_number = ?
				WHERE default_graph_order_number_id = ?
			`;
        server_1.db.promise().query(query, [props.orderNumber, props.defGraphId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Výchozí graf úspěšně zobrazen" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během zobrazení výchozího grafu" };
    }
};
exports.showDefGraphMod = showDefGraphMod;
//# sourceMappingURL=showDefGraphMod.js.map
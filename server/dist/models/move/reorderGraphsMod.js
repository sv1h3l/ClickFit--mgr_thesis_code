"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderGraphsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const reorderGraphsMod = async (props) => {
    try {
        const userGraphsQuery = `
			UPDATE user_graphs
			SET order_number = order_number - 1
			WHERE order_number > ? AND user_id = ?
		`;
        await server_1.db.promise().query(userGraphsQuery, [props.orderNumber, props.userId]);
        const defGraphsQuery = `
			UPDATE default_graphs_order_numbers
			SET order_number = order_number - 1
			WHERE order_number > ? AND user_id = ?
		`;
        await server_1.db.promise().query(defGraphsQuery, [props.orderNumber, props.userId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Záznamy úspěšně přeuspořádány" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během přeuspořádávání záznamů grafu" };
    }
};
exports.reorderGraphsMod = reorderGraphsMod;
//# sourceMappingURL=reorderGraphsMod.js.map
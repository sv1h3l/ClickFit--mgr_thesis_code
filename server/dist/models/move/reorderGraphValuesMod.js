"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderGraphValuesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const reorderGraphValuesMod = async (props) => {
    try {
        const query = `
			UPDATE graph_values
			SET order_number = order_number - 1
			WHERE graph_id = ? AND order_number > ?
		`;
        await server_1.db.promise().query(query, [props.graphId, props.orderNumber]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Záznamy úspěšně přeuspořádányn" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během přeuspořádávání záznamů grafu" };
    }
};
exports.reorderGraphValuesMod = reorderGraphValuesMod;
//# sourceMappingURL=reorderGraphValuesMod.js.map
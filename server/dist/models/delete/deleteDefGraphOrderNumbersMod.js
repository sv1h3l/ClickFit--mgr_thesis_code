"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDefGraphOrderNumbersMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteDefGraphOrderNumbersMod = async (props) => {
    try {
        const query = `
            DELETE FROM default_graphs_order_numbers
			WHERE graph_id = ?
        `;
        await server_1.db.promise().query(query, [props.graphId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Pořadí výchozího grafu úspěšně smazán" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během mazání pořadí výchozího grafu" };
    }
};
exports.deleteDefGraphOrderNumbersMod = deleteDefGraphOrderNumbersMod;
//# sourceMappingURL=deleteDefGraphOrderNumbersMod.js.map
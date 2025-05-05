"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveGraphMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const moveGraphMod = async (props) => {
    try {
        const firstQuery = `
				UPDATE user_graphs
				SET order_number = order_number + ?
				WHERE graph_id = ?
			`;
        server_1.db.promise().query(firstQuery, [props.orderNumber, props.graphId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Pořadí grafu úspěšně změněno" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny pořadí grafu" };
    }
};
exports.moveGraphMod = moveGraphMod;
//# sourceMappingURL=moveGraphMod.js.map
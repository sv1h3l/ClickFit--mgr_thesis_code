"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveGraphValueMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const moveGraphValueMod = async (props) => {
    try {
        const firstQuery = `
				UPDATE graph_values
				SET order_number = order_number - 1
				WHERE graph_value_id = ?
			`;
        server_1.db.promise().query(firstQuery, [props.firstGraphValueId]);
        const secondQuery = `
				UPDATE graph_values
				SET order_number = order_number + 1
				WHERE graph_value_id = ?
			`;
        server_1.db.promise().query(secondQuery, [props.secondGraphValueId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Pořadí záznamů grafu úspěšně změněno" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny pořadí záznamů grafu" };
    }
};
exports.moveGraphValueMod = moveGraphValueMod;
//# sourceMappingURL=moveGraphValueMod.js.map
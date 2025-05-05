"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphValueMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createGraphValueMod = async (props) => {
    try {
        const query = `
			INSERT INTO graph_values (
				graph_id, user_id, is_default_graph_value, y_axis_value, x_axis_value, order_number, is_goal
			)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`;
        const [result] = await server_1.db.promise().query(query, [props.graphId, props.userId, props.isDefaultGraphValue, props.yAxisValue, props.xAxisValue, props.orderNumber, props.isGoal]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Záznam grafu úspěšně vytvořen", data: { graphValueId: result.insertId } };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření uživatelského grafu" };
    }
};
exports.createGraphValueMod = createGraphValueMod;
//# sourceMappingURL=createGraphValueMod.js.map
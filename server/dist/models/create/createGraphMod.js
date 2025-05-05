"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createGraphMod = async (props) => {
    try {
        const query = `
			INSERT INTO user_graphs (
				sport_id, graph_label, user_id,
				x_axis_label, y_axis_label, has_date,
				order_number, unit, has_goals
			)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;
        const [result] = await server_1.db.promise().query(query, [props.sportId, props.graphLabel, props.userId, props.xAxisLabel, props.yAxisLabel, props.hasDate, props.orderNumber, props.unit, props.hasGoals]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Uživatelský graf úspěšně vytvořen", data: { graphId: result.insertId } };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření uživatelského grafu" };
    }
};
exports.createGraphMod = createGraphMod;
//# sourceMappingURL=createGraphMod.js.map
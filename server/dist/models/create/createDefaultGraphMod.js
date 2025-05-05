"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultGraphMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createDefaultGraphMod = async (props) => {
    try {
        const query = `
			INSERT INTO default_graphs (
				sport_id, graph_label,
				x_axis_label, y_axis_label, has_date,
				unit, has_goals
			)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`;
        const [result] = await server_1.db.promise().query(query, [props.sportId, props.graphLabel, props.xAxisLabel, props.yAxisLabel, props.hasDate, props.unit, props.hasGoals]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Výchozí graf úspěšně vytvořen", data: { graphId: result.insertId } };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření výchozího grafu" };
    }
};
exports.createDefaultGraphMod = createDefaultGraphMod;
//# sourceMappingURL=createDefaultGraphMod.js.map
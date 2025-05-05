"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeGraphMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeGraphMod = async (props) => {
    try {
        const query = `
			UPDATE ${props.isDefGraph ? "default_graphs" : "user_graphs"}
			SET	graph_label = ?,
				has_date = ?,
				y_axis_label = ?,
				x_axis_label = ?,
				unit = ?,
				has_goals = ?
			WHERE graph_id = ?
		`;
        await server_1.db.promise().query(query, [props.graphLabel, props.hasDate, props.yAxisLabel, props.xAxisLabel, props.unit, props.hasGoals, props.graphId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Graf úspěšně změnen" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny grafu" };
    }
};
exports.changeGraphMod = changeGraphMod;
//# sourceMappingURL=changeGraphMod.js.map
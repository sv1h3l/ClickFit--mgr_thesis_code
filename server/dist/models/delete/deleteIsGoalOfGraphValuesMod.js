"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIsGoalOfGraphValuesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteIsGoalOfGraphValuesMod = async (props) => {
    try {
        const query = `
			UPDATE graph_values
			SET	is_goal = 0 
			WHERE graph_id = ? AND is_default_graph_value = ?
		`;
        await server_1.db.promise().query(query, [props.graphId, props.isDefGraph]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Cíle záznamů grafu úspěšně smazány" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během mazání cílů záznamů grafu" };
    }
};
exports.deleteIsGoalOfGraphValuesMod = deleteIsGoalOfGraphValuesMod;
//# sourceMappingURL=deleteIsGoalOfGraphValuesMod.js.map
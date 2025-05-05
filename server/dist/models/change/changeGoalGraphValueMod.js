"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeGoalGraphValueMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeGoalGraphValueMod = async (props) => {
    try {
        const query = `
				UPDATE graph_values
				SET is_goal = ?
				WHERE graph_value_id = ?
			`;
        const [result] = await server_1.db.promise().query(query, [props.isGoal, props.graphValueId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Cíl grafu úspěšně změněn" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny cíle grafu" };
    }
};
exports.changeGoalGraphValueMod = changeGoalGraphValueMod;
//# sourceMappingURL=changeGoalGraphValueMod.js.map
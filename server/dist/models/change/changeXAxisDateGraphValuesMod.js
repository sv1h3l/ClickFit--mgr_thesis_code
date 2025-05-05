"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeXAxisDateGraphValuesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeXAxisDateGraphValuesMod = async (props) => {
    try {
        const query = `
			UPDATE graph_values
			SET	x_axis_value = ? 
			WHERE graph_id = ? AND is_default_graph_value = ?
		`;
        await server_1.db.promise().query(query, [props.formattedDate, props.graphId, props.isDefGraph]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Záznamy grafu úspěšně změneny" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny záznamů grafu" };
    }
};
exports.changeXAxisDateGraphValuesMod = changeXAxisDateGraphValuesMod;
//# sourceMappingURL=changeXAxisDateGraphValuesMod.js.map
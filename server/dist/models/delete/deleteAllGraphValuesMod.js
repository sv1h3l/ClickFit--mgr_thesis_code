"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllGraphValuesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteAllGraphValuesMod = async (props) => {
    try {
        const query = `
            DELETE FROM graph_values
			WHERE graph_id = ? AND is_default_graph_value = ?
        `;
        await server_1.db.promise().query(query, [props.graphId, props.isDefGraph]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Záznamy grafu úspěšně smazány" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během mazání záznamů grafu" };
    }
};
exports.deleteAllGraphValuesMod = deleteAllGraphValuesMod;
//# sourceMappingURL=deleteAllGraphValuesMod.js.map
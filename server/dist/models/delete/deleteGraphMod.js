"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGraphMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteGraphMod = async (props) => {
    try {
        const query = `
			DELETE FROM ${props.isDefGraph ? "default_graphs" : "user_graphs"}
			WHERE graph_id = ?
		`;
        await server_1.db.promise().query(query, [props.graphId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Graf úspěšně odstraněn" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během odstranění grafu" };
    }
};
exports.deleteGraphMod = deleteGraphMod;
//# sourceMappingURL=deleteGraphMod.js.map
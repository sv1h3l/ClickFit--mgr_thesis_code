"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGraphValueMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteGraphValueMod = async (props) => {
    try {
        const query = `
            DELETE FROM graph_values WHERE graph_value_id = ?
        `;
        await server_1.db.promise().query(query, [props.graphValueId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Záznam grafu úspěšně smazán" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během mazání záznamu grafu" };
    }
};
exports.deleteGraphValueMod = deleteGraphValueMod;
//# sourceMappingURL=deleteGraphValueMod.js.map
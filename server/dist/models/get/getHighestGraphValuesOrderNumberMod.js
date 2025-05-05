"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHighestGraphValuesOrderNumberMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getHighestGraphValuesOrderNumberMod = async (props) => {
    try {
        const query = `
			SELECT COUNT(*) AS count
			FROM graph_values
			WHERE user_id = ? AND graph_id = ? AND is_default_graph_value = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.userId, props.graphId, props.isDefaultGraphValue]);
        const count = rows[0]?.count ?? 0;
        return {
            status: GenResEnum_1.GenEnum.SUCCESS,
            message: "Počet hodnot grafu úspěšně získán",
            data: { highestOrderNumber: count },
        };
    }
    catch (error) {
        console.error("Database error: " + error);
        return {
            status: GenResEnum_1.GenEnum.FAILURE,
            message: "Nastala chyba během získávání počtu hodnot grafu",
        };
    }
};
exports.getHighestGraphValuesOrderNumberMod = getHighestGraphValuesOrderNumberMod;
//# sourceMappingURL=getHighestGraphValuesOrderNumberMod.js.map
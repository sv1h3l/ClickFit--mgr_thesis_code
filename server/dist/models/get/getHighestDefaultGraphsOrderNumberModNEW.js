"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHighestDefaultGraphsOrderNumberModNEW = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getHighestDefaultGraphsOrderNumberModNEW = async (props) => {
    try {
        const query = `
			SELECT COUNT(*) AS count
			FROM default_graphs_order_numbers
			WHERE user_id = ? AND order_number != 0;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.userId]);
        const count = rows[0]?.count ?? 0;
        return {
            status: GenResEnum_1.GenEnum.SUCCESS,
            message: "Počet výchozích grafů s nenulovým pořadím úspěšně získán",
            data: { highestOrderNumber: count },
        };
    }
    catch (error) {
        console.error("Database error: " + error);
        return {
            status: GenResEnum_1.GenEnum.FAILURE,
            message: "Nastala chyba během získávání výchozích grafů s nenulovým pořadím",
        };
    }
};
exports.getHighestDefaultGraphsOrderNumberModNEW = getHighestDefaultGraphsOrderNumberModNEW;
//# sourceMappingURL=getHighestDefaultGraphsOrderNumberModNEW.js.map
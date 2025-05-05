"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHighestGraphsOrderNumberMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getHighestGraphsOrderNumberMod = async (props) => {
    try {
        const query = `
			SELECT COUNT(*) AS count
			FROM user_graphs
			WHERE user_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.userId]);
        const count = rows[0]?.count ?? 0;
        return {
            status: GenResEnum_1.GenEnum.SUCCESS,
            message: "Počet uživatelských grafů úspěšně získán",
            data: { highestOrderNumber: count },
        };
    }
    catch (error) {
        console.error("Database error: " + error);
        return {
            status: GenResEnum_1.GenEnum.FAILURE,
            message: "Nastala chyba během získávání uživatelských grafů",
        };
    }
};
exports.getHighestGraphsOrderNumberMod = getHighestGraphsOrderNumberMod;
//# sourceMappingURL=getHighestGraphsOrderNumberMod.js.map
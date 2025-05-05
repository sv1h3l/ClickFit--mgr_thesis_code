"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSportDetailLabsMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getSportDetailLabsMod = async (props) => {
    try {
        const query = `
			SELECT 
				sport_detail_label_id,
				label,
				order_number
			FROM sport_detail_labels 
			WHERE sport_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Štíky podrobností sportu úspěšně předány", data: rows };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání štíků podrobností sportu" };
    }
};
exports.getSportDetailLabsMod = getSportDetailLabsMod;
//# sourceMappingURL=getSportDetailLabsMod.js.map
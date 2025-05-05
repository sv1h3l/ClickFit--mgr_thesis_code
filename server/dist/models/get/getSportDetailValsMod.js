"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSportDetailValsMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getSportDetailValsMod = async (props) => {
    try {
        const query = `
			SELECT 
				sdv.sport_detail_value_id,
				sdv.sport_detail_label_id,
				sdv.value
			FROM sport_detail_values sdv
			JOIN sport_detail_labels sdl 
				ON sdv.sport_detail_label_id = sdl.sport_detail_label_id
			WHERE sdl.sport_id = ? AND sdv.user_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.sportId, props.userId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Hodnoty podrobností sportu úspěšně předány", data: rows };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání hodnot podrobností sportu" };
    }
};
exports.getSportDetailValsMod = getSportDetailValsMod;
//# sourceMappingURL=getSportDetailValsMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSportMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getSportMod = async (props) => {
    try {
        const query = `
			SELECT * FROM sports
			WHERE sport_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Sport úspěšně předán", data: rows[0] };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání hodnot podrobností sportu" };
    }
};
exports.getSportMod = getSportMod;
//# sourceMappingURL=getSportMod.js.map
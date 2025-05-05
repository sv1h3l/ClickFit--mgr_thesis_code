"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultUnitCodeMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getDefaultUnitCodeMod = async (props) => {
    try {
        const query = `
			SELECT unit_code
			FROM sports
			WHERE sport_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.sportId]);
        const unitCode = rows[0].unit_code || 0;
        return { status: GenResEnum_1.GenEnum.SUCCESS, data: unitCode };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Chyba při získání kódu jednotky" };
    }
};
exports.getDefaultUnitCodeMod = getDefaultUnitCodeMod;
//# sourceMappingURL=getDefaultUnitCodeMod.js.map
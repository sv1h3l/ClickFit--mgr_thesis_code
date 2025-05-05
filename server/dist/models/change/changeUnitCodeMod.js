"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUnitCodeMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUnitCodeMod = async (props) => {
    try {
        const query = `
				UPDATE sports
				SET unit_code = ?
				WHERE sport_id = ?
			`;
        await server_1.db.promise().query(query, [props.unitCode, props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Jednotka sportu úspěšně změněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny jednotky sportu" };
    }
};
exports.changeUnitCodeMod = changeUnitCodeMod;
//# sourceMappingURL=changeUnitCodeMod.js.map
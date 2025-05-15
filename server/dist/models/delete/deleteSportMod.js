"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSportMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteSportMod = async (props) => {
    try {
        const query = `
			DELETE FROM sports
			WHERE sport_id = ?
		`;
        await server_1.db.promise().query(query, [props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Sport úspěšně smazán" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během mazání sportu" };
    }
};
exports.deleteSportMod = deleteSportMod;
//# sourceMappingURL=deleteSportMod.js.map
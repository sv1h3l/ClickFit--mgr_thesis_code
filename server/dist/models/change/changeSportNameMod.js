"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportNameMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeSportNameMod = async (props) => {
    try {
        const query = `
				UPDATE sports
				SET sport_name = ?
				WHERE sport_id = ?
			`;
        await server_1.db.promise().query(query, [props.sportName, props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Název sportu úspěšně změněn" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny názvu sportu" };
    }
};
exports.changeSportNameMod = changeSportNameMod;
//# sourceMappingURL=changeSportNameMod.js.map
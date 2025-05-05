"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportDescMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeSportDescMod = async (props) => {
    try {
        const query = `
				UPDATE sports
				SET description = ?
				WHERE sport_id = ?
			`;
        await server_1.db.promise().query(query, [props.description, props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Popis sportu úspěšně změněn" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny popisu sportu" };
    }
};
exports.changeSportDescMod = changeSportDescMod;
//# sourceMappingURL=changeSportDescMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportHasDifficultiesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeSportHasDifficultiesMod = async (props) => {
    try {
        const query = props.hasDifficulties
            ? `
				UPDATE sports
				SET has_difficulties = ?
				WHERE sport_id = ?
			`
            : `
				UPDATE sports
				SET has_difficulties = ?, has_recommended_difficulty_values = false
				WHERE sport_id = ?
			`;
        await server_1.db.promise().query(query, [props.hasDifficulties, props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Hodnota obtížností cviků úspěšně změněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny obtížností cviků sportu" };
    }
};
exports.changeSportHasDifficultiesMod = changeSportHasDifficultiesMod;
//# sourceMappingURL=changeSportHasDifficultiesMod.js.map
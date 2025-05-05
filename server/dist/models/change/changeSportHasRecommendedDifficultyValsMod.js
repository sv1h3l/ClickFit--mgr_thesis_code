"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportHasRecommendedDifficultyValsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeSportHasRecommendedDifficultyValsMod = async (props) => {
    try {
        const query = `
				UPDATE sports
				SET has_recommended_difficulty_values = ?
				WHERE sport_id = ?
			`;
        await server_1.db.promise().query(query, [props.hasRecommendedDifficultyValues, props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Doporučené hodnoty obtížností úspěšně změněny" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny doporučených hodnot obtížností" };
    }
};
exports.changeSportHasRecommendedDifficultyValsMod = changeSportHasRecommendedDifficultyValsMod;
//# sourceMappingURL=changeSportHasRecommendedDifficultyValsMod.js.map
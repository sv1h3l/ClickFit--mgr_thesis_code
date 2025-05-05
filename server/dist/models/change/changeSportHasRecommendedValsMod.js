"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportHasRecommendedValsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeSportHasRecommendedValsMod = async (props) => {
    try {
        const query = props.hasRecommendedValues
            ? `
				UPDATE sports
				SET has_recommended_values = ?
				WHERE sport_id = ?
			`
            : `
				UPDATE sports
				SET has_recommended_values = ?, has_recommended_difficulty_values = false
				WHERE sport_id = ?
			`;
        await server_1.db.promise().query(query, [props.hasRecommendedValues, props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Doporučené hodnoty úspěšně změněny" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny doporučených hodnot" };
    }
};
exports.changeSportHasRecommendedValsMod = changeSportHasRecommendedValsMod;
//# sourceMappingURL=changeSportHasRecommendedValsMod.js.map
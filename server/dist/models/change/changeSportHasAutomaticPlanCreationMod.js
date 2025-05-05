"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportHasAutomaticPlanCreationMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeSportHasAutomaticPlanCreationMod = async (props) => {
    try {
        const query = `
				UPDATE sports
				SET has_automatic_plan_creation = ?
				WHERE sport_id = ?
			`;
        await server_1.db.promise().query(query, [props.hasAutomaticPlanCreation, props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Automatická tvorba tréninku úspěšně změněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny automatické tvorby tréninku" };
    }
};
exports.changeSportHasAutomaticPlanCreationMod = changeSportHasAutomaticPlanCreationMod;
//# sourceMappingURL=changeSportHasAutomaticPlanCreationMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportHasCategoriesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeSportHasCategoriesMod = async (props) => {
    try {
        const query = `
				UPDATE sports
				SET has_categories = ?
				WHERE sport_id = ?
			`;
        await server_1.db.promise().query(query, [props.hasCategories, props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Hodnota kategorií úspěšně změněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny kategorií sportu" };
    }
};
exports.changeSportHasCategoriesMod = changeSportHasCategoriesMod;
//# sourceMappingURL=changeSportHasCategoriesMod.js.map
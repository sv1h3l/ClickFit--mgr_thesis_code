"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCategoryMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeCategoryMod = async (props) => {
    try {
        const query = `
				UPDATE exercises
				SET order_number = ?, category_id = ?
				WHERE sport_id = ? AND exercise_id = ?;
			`;
        await server_1.db.promise().query(query, [props.highestOrderNumber, props.categoryId, props.sportId, props.exerciseId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Kategorie cviku úspešně změněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během změny kategorie cviku" };
    }
};
exports.changeCategoryMod = changeCategoryMod;
//# sourceMappingURL=changeCategoryMod.js.map
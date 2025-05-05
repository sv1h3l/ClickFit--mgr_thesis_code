"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDescMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeDescMod = async (props) => {
    try {
        const query = `
				UPDATE ${props.changeExerciseDesc ? "exercises" : "categories"}
				SET description = ?
				WHERE sport_id = ? AND ${props.changeExerciseDesc ? "exercise_id" : "category_id"} = ?
			`;
        await server_1.db.promise().query(query, [props.description, props.sportId, props.entityId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: `Popis ${props.changeExerciseDesc ? "cviku" : "kategorie"} úspěšně změněn` };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: `Nastala chyba během změny popisu ${props.changeExerciseDesc ? "cviku" : "kategorie"}` };
    }
};
exports.changeDescMod = changeDescMod;
//# sourceMappingURL=changeDescMod.js.map
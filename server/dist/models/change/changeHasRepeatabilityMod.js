"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeHasRepeatabilityMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeHasRepeatabilityMod = async (props) => {
    try {
        const query = `
				UPDATE ${props.entityIsExercise ? "exercises" : "categories"}
				SET has_repeatability = ?
				WHERE ${props.entityIsExercise ? "exercise_id" : "category_id"} = ?
			`;
        await server_1.db.promise().query(query, [props.hasRepeatability, props.entityId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: `Opakovatelnost ${props.entityIsExercise ? "cviku" : "kategorie"} úspěšně změněna` };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: `Nastala chyba během změny opakovatelnosti ${props.entityIsExercise ? "cviku" : "kategorie"}` };
    }
};
exports.changeHasRepeatabilityMod = changeHasRepeatabilityMod;
//# sourceMappingURL=changeHasRepeatabilityMod.js.map
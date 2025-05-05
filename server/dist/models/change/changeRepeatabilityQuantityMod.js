"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRepeatabilityQuantityMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeRepeatabilityQuantityMod = async (props) => {
    try {
        const query = `
				UPDATE ${props.entityIsExercise ? "exercises" : "categories"}
				SET repeatability_quantity = ?
				WHERE ${props.entityIsExercise ? "exercise_id" : "category_id"} = ?
			`;
        await server_1.db.promise().query(query, [props.repeatabilityQuantity, props.entityId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: `Maximální počet opakování ${props.entityIsExercise ? "cviku" : "kategorie"} úspěšně změněn` };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: `Nastala chyba během změny maximálního početu opakování ${props.entityIsExercise ? "cviku" : "kategorie"}` };
    }
};
exports.changeRepeatabilityQuantityMod = changeRepeatabilityQuantityMod;
//# sourceMappingURL=changeRepeatabilityQuantityMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeTightEntityMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeTightEntityMod = async (props) => {
    try {
        const query = `
				UPDATE ${props.entityIsExercise ? "exercises" : "categories"}
				SET tight_connection = ?
				WHERE ${props.entityIsExercise ? "exercise_id" : "category_id"} = ?
			`;
        await server_1.db.promise().query(query, [JSON.stringify(props.tightConnectionEntityId), props.entityId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: `Pevná návaznost ${props.entityIsExercise ? "cviku" : "kategorie"} úspěšně změněny` };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: `Nastala chyba během změny pevné návaznosti ${props.entityIsExercise ? "cviku" : "kategorie"}` };
    }
};
exports.changeTightEntityMod = changeTightEntityMod;
//# sourceMappingURL=changeTightEntityMod.js.map
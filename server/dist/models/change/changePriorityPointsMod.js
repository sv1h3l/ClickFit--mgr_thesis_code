"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePriorityPointsMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changePriorityPointsMod = async (props) => {
    try {
        const query = `
				UPDATE ${props.entityIsExercise ? "exercises" : "categories"}
				SET priority_points = ?
				WHERE ${props.entityIsExercise ? "exercise_id" : "category_id"} = ?
			`;
        await server_1.db.promise().query(query, [JSON.stringify(props.priorityPoints), props.entityId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: `Prioritní body ${props.entityIsExercise ? "cviku" : "kategorie"} úspěšně změněny` };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: `Nastala chyba během změny prioritních bodů ${props.entityIsExercise ? "cviku" : "kategorie"}` };
    }
};
exports.changePriorityPointsMod = changePriorityPointsMod;
//# sourceMappingURL=changePriorityPointsMod.js.map
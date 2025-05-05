"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExerciseMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteExerciseMod = async ({ props }) => {
    try {
        const query = `
            DELETE FROM exercises WHERE sport_id = ? AND exercise_id = ?
        `;
        await server_1.db.promise().query(query, [props.sportId, props.exerciseId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS };
    }
    catch (error) {
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Database error: " + error };
    }
};
exports.deleteExerciseMod = deleteExerciseMod;
//# sourceMappingURL=deleteExerciseMod.js.map
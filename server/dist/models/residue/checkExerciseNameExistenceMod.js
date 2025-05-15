"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExerciseNameExistenceMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkExerciseNameExistenceMod = async (props) => {
    const checkQuery = `SELECT * FROM exercises WHERE sport_id = ? AND name = ? LIMIT 1`;
    try {
        const [authorizedPerson] = await server_1.db.promise().query(checkQuery, [props.sportId, props.exerciseName]);
        if (authorizedPerson.length > 0) {
            return { status: GenResEnum_1.GenEnum.ALREADY_EXISTS, message: "Cvik s tímto názvem již existuje" };
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
};
exports.checkExerciseNameExistenceMod = checkExerciseNameExistenceMod;
//# sourceMappingURL=checkExerciseNameExistenceMod.js.map
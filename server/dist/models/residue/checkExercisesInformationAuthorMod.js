"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExercisesInformationAuthorMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkExercisesInformationAuthorMod = async (userId, id) => {
    const checkQuery = `SELECT * FROM exercise_information_values WHERE user_id = ? AND exercise_information_value_id = ? LIMIT 1`;
    try {
        const [authorizedPerson] = await server_1.db.promise().query(checkQuery, [userId, id]);
        if (authorizedPerson.length > 0) {
            return { status: GenResEnum_1.GenEnum.SUCCESS };
        }
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
};
exports.checkExercisesInformationAuthorMod = checkExercisesInformationAuthorMod;
//# sourceMappingURL=checkExercisesInformationAuthorMod.js.map
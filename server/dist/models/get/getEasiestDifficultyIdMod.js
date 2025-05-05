"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEasiestDifficultyIdMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getEasiestDifficultyIdMod = async (props) => {
    try {
        const getUnassignedDifficultyIdQuery = `
			SELECT sport_difficulty_id
			FROM sport_difficulties
			WHERE sport_id = ? AND order_number = 1;
		`;
        const [rows] = await server_1.db.promise().query(getUnassignedDifficultyIdQuery, [props.sportId]);
        const unassignedDifficultyId = rows[0].sport_difficulty_id || -1;
        return { status: GenResEnum_1.GenEnum.SUCCESS, data: unassignedDifficultyId };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Chyba při získání ID nejlehčí obtížnosti" };
    }
};
exports.getEasiestDifficultyIdMod = getEasiestDifficultyIdMod;
//# sourceMappingURL=getEasiestDifficultyIdMod.js.map
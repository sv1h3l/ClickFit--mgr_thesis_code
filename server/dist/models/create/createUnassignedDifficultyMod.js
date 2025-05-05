"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultDifficultiesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createDefaultDifficultiesMod = async (sportId) => {
    try {
        const insertQuery = `
            INSERT INTO sport_difficulties (sport_id, difficulty_name, order_number)
            VALUES
				(?, "Lehká", 1),
				(?, "Střední", 2),
				(?, "Těžká", 3)
        `;
        await server_1.db.promise().query(insertQuery, [sportId, sportId, sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
};
exports.createDefaultDifficultiesMod = createDefaultDifficultiesMod;
//# sourceMappingURL=createUnassignedDifficultyMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSportDifficultyMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteSportDifficultyMod = async (props) => {
    try {
        const query = `
            DELETE FROM sport_difficulties
			WHERE sport_id = ? AND sport_difficulty_id = ?
       	`;
        await server_1.db.promise().query(query, [props.sportId, props.sportDifficultyId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Obtížnost úspěšně odstraněna" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během odstraňování obtížnosti" };
    }
};
exports.deleteSportDifficultyMod = deleteSportDifficultyMod;
//# sourceMappingURL=deleteSportDifficultyMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderTwoSportDifficultiesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const reorderTwoSportDifficultiesMod = async (props) => {
    try {
        props.reorderDifficulties.map(async (difficulty) => {
            const query = `
				UPDATE sport_difficulties
				SET order_number = ?
				WHERE sport_id = ? AND sport_difficulty_id = ?
			`;
            await server_1.db.promise().query(query, [difficulty.orderNumber, props.sportId, difficulty.difficultyId]);
        });
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Obtížnosti úspěšně přeuspořádány" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během přeusporádávání obtížností" };
    }
};
exports.reorderTwoSportDifficultiesMod = reorderTwoSportDifficultiesMod;
//# sourceMappingURL=reorderTwoSportDifficultiesMod.js.map
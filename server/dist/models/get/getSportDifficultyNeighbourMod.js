"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSportDifficultyNeighbourMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getSportDifficultyNeighbourMod = async (props) => {
    try {
        const easierDifficultyQuery = `
			SELECT sport_difficulty_id
			FROM sport_difficulties
			WHERE sport_id = ? AND order_number = ? - 1;
		`;
        const [easierRows] = await server_1.db.promise().query(easierDifficultyQuery, [props.sportId, props.orderNumber]);
        if (easierRows.length === 1) {
            return { status: GenResEnum_1.GenEnum.SUCCESS, data: easierRows[0].sport_difficulty_id };
        }
        else {
            const harderDifficultyQuery = `
				SELECT sport_difficulty_id
				FROM sport_difficulties
				WHERE sport_id = ? AND order_number = ? + 1;
			`;
            const [harderRows] = await server_1.db.promise().query(harderDifficultyQuery, [props.sportId, props.orderNumber]);
            if (harderRows.length === 1) {
                return { status: GenResEnum_1.GenEnum.SUCCESS, data: harderRows[0].sport_difficulty_id };
            }
            else {
                return { status: GenResEnum_1.GenEnum.FAILURE, data: -1 };
            }
        }
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Chyba při získávání ID okolní obtížnosti" };
    }
};
exports.getSportDifficultyNeighbourMod = getSportDifficultyNeighbourMod;
//# sourceMappingURL=getSportDifficultyNeighbourMod.js.map
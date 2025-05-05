"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderSportDifficultiesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const reorderSportDifficultiesMod = async (props) => {
    try {
        const query = `
			UPDATE sport_difficulties
			SET order_number = order_number - 1
			WHERE sport_id = ? AND order_number > ?
		`;
        await server_1.db.promise().query(query, [props.sportId, props.orderNumber]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Obtížnosti úspěšně přeuspořádány" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během přeusporádávání obtížností" };
    }
};
exports.reorderSportDifficultiesMod = reorderSportDifficultiesMod;
//# sourceMappingURL=reorderSportDifficultiesMod.js.map
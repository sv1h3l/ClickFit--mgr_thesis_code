"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDifficultiesMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getDifficultiesMod = async (props) => {
    try {
        const query = `
			SELECT 
				sport_difficulty_id,
				difficulty_name,
				order_number
			FROM sport_difficulties 
			WHERE sport_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.sportId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Obtížnosti úspěšně předány", data: rows };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání obtížností" };
    }
};
exports.getDifficultiesMod = getDifficultiesMod;
//# sourceMappingURL=getDifficultiesMod.js.map
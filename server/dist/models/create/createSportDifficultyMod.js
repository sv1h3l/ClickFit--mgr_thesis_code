"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSportDifficultyMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createSportDifficultyMod = async (props) => {
    const checkQuery = `SELECT * FROM sport_difficulties WHERE sport_id = ? AND difficulty_name = ? LIMIT 1`;
    try {
        const [existingDiffictuly] = await server_1.db.promise().query(checkQuery, [props.sportId, props.difficultyName]);
        if (existingDiffictuly.length > 0) {
            return { status: GenResEnum_1.GenEnum.ALREADY_EXISTS, message: "Obtížnost s tímto názvem již existuje" };
        }
        const query = `
				INSERT INTO sport_difficulties (sport_id, order_number, difficulty_name)
				VALUES (?, ?, ?)
			`;
        const [result] = await server_1.db.promise().query(query, [props.sportId, props.orderNumber, props.difficultyName]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Obtížnost úspěšně vytvořena", data: result.insertId };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření obtížnosti" };
    }
};
exports.createSportDifficultyMod = createSportDifficultyMod;
//# sourceMappingURL=createSportDifficultyMod.js.map
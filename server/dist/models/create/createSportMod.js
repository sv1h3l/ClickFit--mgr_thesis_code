"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSportMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createSportMod = async (userId, sportName) => {
    const checkQuery = `SELECT sport_id FROM sports WHERE user_id = ? AND sport_name = ? LIMIT 1`;
    try {
        const [existingSport] = await server_1.db.promise().query(checkQuery, [userId, sportName]);
        if (existingSport.length > 0) {
            return { status: GenResEnum_1.GenEnum.ALREADY_EXISTS, message: "Sport s tímto názvem již existuje" };
        }
        const insertQuery = `
            INSERT INTO sports (user_id, sport_name, description)
            VALUES (?, ?, "Zde je vhodné napsat obecný popis sportu.")
        `;
        const [result] = await server_1.db.promise().query(insertQuery, [userId, sportName]);
        const sportId = result.insertId;
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Sport byl úspěšně vytvořen", data: { sportId } };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření sportu" };
    }
};
exports.createSportMod = createSportMod;
//# sourceMappingURL=createSportMod.js.map
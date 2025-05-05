"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiaryMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getDiaryMod = async (props) => {
    try {
        const query = `
			SELECT 
				diary_id,
				sport_id,
				content
			FROM diaries
			WHERE sport_id = ? AND user_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(query, [props.sportId, props.userId]);
        if (rows.length === 0) {
            return { status: GenResEnum_1.GenEnum.NOT_FOUND, message: "Deník nebyl nalezen" };
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Deník úspěšně předán", data: rows[0] };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání deníku" };
    }
};
exports.getDiaryMod = getDiaryMod;
//# sourceMappingURL=getDiaryMod.js.map
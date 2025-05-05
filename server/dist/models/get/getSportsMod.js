"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSportsMod = exports.GetSportsStatus = void 0;
const server_1 = require("../../server"); // Import připojení k DB
var GetSportsStatus;
(function (GetSportsStatus) {
    GetSportsStatus[GetSportsStatus["SUCCESS"] = 0] = "SUCCESS";
    GetSportsStatus[GetSportsStatus["FAILURE"] = 1] = "FAILURE";
})(GetSportsStatus || (exports.GetSportsStatus = GetSportsStatus = {}));
const getSportsMod = async (userId) => {
    try {
        const query = `
			SELECT 
				sports.sport_id, 
				sports.user_id, 
				sports.sport_name, 
				sports.description,
				sports.has_categories,
				sports.has_difficulties,
				sports.has_recommended_values,
				sports.has_recommended_difficulty_values,
				sports.has_automatic_plan_creation,
				sports.unit_code,
				users.first_name,
				users.last_name
			FROM sports
			JOIN users ON sports.user_id = users.user_id
			WHERE sports.user_id = ?
			   OR sports.sport_id IN (
					SELECT sport_id
					FROM shared_sports
					WHERE user_id = ?
			   );
		`;
        const [rows] = await server_1.db.promise().query(query, [userId, userId]);
        return rows;
    }
    catch (error) {
        console.error("Database error: ", error);
        return [];
    }
};
exports.getSportsMod = getSportsMod;
//# sourceMappingURL=getSportsMod.js.map
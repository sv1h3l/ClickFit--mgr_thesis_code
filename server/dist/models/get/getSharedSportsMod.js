"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedSportsMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const getSharedSportsMod = async (props) => {
    try {
        const query = `
			SELECT 
				shared_sport_id, 
				sport_id, 
				user_id, 
				author_id
			FROM shared_sports
			WHERE author_id = ? AND user_id = ?
		`;
        const [rows] = await server_1.db.promise().query(query, [props.authorId, props.userId]);
        return rows;
    }
    catch (error) {
        console.error("Database error: ", error);
        return [];
    }
};
exports.getSharedSportsMod = getSharedSportsMod;
//# sourceMappingURL=getSharedSportsMod.js.map
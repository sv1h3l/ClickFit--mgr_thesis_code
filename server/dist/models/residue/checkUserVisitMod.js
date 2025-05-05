"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserVisitMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkUserVisitMod = async (props) => {
    const checkQuery = `
		SELECT connection_id FROM connections
		WHERE 
			(first_user_id = ? AND second_user_id = ?)
			OR
			(first_user_id = ? AND second_user_id = ?)
		LIMIT 1
	`;
    try {
        const [rows] = await server_1.db
            .promise()
            .query(checkQuery, [
            props.userId,
            props.visitedUserId,
            props.visitedUserId,
            props.userId,
        ]);
        if (rows.length > 0) {
            return { status: GenResEnum_1.GenEnum.SUCCESS };
        }
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
    catch (error) {
        console.error("Database error:", error);
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
};
exports.checkUserVisitMod = checkUserVisitMod;
//# sourceMappingURL=checkUserVisitMod.js.map
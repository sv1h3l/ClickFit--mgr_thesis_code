"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSharedSportMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkSharedSportMod = async (props) => {
    const checkQuery = `SELECT * FROM shared_sports WHERE user_id = ? AND sport_id = ? LIMIT 1`;
    try {
        const [authorizedPerson] = await server_1.db.promise().query(checkQuery, [props.userId, props.sharedSportId]);
        if (authorizedPerson.length > 0) {
            return { status: GenResEnum_1.GenEnum.SUCCESS };
        }
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
};
exports.checkSharedSportMod = checkSharedSportMod;
//# sourceMappingURL=checkSharedSportMod.js.map
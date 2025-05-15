"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSportNameExistenceMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkSportNameExistenceMod = async (props) => {
    const checkQuery = `SELECT * FROM sports WHERE user_id = ? AND sport_name = ? LIMIT 1`;
    try {
        const [authorizedPerson] = await server_1.db.promise().query(checkQuery, [props.userId, props.sportName]);
        if (authorizedPerson.length > 0) {
            return { status: GenResEnum_1.GenEnum.ALREADY_EXISTS, message: "Sport s tímto názvem již existuje" };
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE };
    }
};
exports.checkSportNameExistenceMod = checkSportNameExistenceMod;
//# sourceMappingURL=checkSportNameExistenceMod.js.map
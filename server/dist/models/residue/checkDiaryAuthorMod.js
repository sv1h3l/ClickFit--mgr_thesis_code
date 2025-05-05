"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDiaryAuthorMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkDiaryAuthorMod = async (props) => {
    const checkQuery = `SELECT * FROM diaries WHERE user_id = ? AND diary_id = ? LIMIT 1`;
    try {
        const [authorizedPerson] = await server_1.db.promise().query(checkQuery, [props.userId, props.diaryId]);
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
exports.checkDiaryAuthorMod = checkDiaryAuthorMod;
//# sourceMappingURL=checkDiaryAuthorMod.js.map
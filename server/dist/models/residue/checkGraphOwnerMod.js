"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGraphOwnerMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkGraphOwnerMod = async (props) => {
    const checkQuery = `SELECT * FROM user_graphs WHERE user_id = ? AND graph_id = ? LIMIT 1`;
    try {
        const [authorizedPerson] = await server_1.db.promise().query(checkQuery, [props.userId, props.graphId]);
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
exports.checkGraphOwnerMod = checkGraphOwnerMod;
//# sourceMappingURL=checkGraphOwnerMod.js.map
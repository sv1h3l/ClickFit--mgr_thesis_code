"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExistingConnectionMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkExistingConnectionMod = async (props) => {
    const checkQuery = `
					SELECT * FROM connections
					WHERE (first_user_id = ? AND second_user_id = ?) OR (first_user_id = ? AND second_user_id = ?) LIMIT 1
				`;
    try {
        const [connection] = await server_1.db.promise().query(checkQuery, [props.firstUserId, props.secondUserId, props.secondUserId, props.firstUserId]);
        if (connection.length > 0) {
            return { status: GenResEnum_1.GenEnum.ALREADY_EXISTS, message: "Spojení je již navázáno" };
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Spojení ještě není navázáno" };
    }
    catch (error) {
        console.error("Database error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během kontroly navázaného spojení" };
    }
};
exports.checkExistingConnectionMod = checkExistingConnectionMod;
//# sourceMappingURL=checkExistingConnectionMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessagesMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getMessagesMod = async (props) => {
    try {
        const secondUserQuery = `
			SELECT
				message_id AS messageId,
				connection_id AS connectionId,
				message,
				image_url AS imageUrl,
				created_at AS createdAt,
				user_id AS userId
			FROM chats
			WHERE connection_id = ?;
		`;
        const [rows] = await server_1.db.promise().query(secondUserQuery, [props.connectionId]);
        return {
            status: GenResEnum_1.GenEnum.SUCCESS,
            message: "Zprávy nalezeny",
            data: rows,
        };
    }
    catch (error) {
        console.error("Database error: ", error);
        return {
            status: GenResEnum_1.GenEnum.FAILURE,
            message: "Nastala chyba během hledání zpráv",
        };
    }
};
exports.getMessagesMod = getMessagesMod;
//# sourceMappingURL=getMessagesMod.js.map
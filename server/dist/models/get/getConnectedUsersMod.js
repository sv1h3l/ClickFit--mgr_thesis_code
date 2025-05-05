"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectedUsersMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getConnectedUsersMod = async (props) => {
    try {
        const secondUsersQuery = `
						SELECT 
							c.connection_id AS connectionId,
							c.second_user_id AS connectedUserId,
							c.first_user_order_number AS orderNumber,
							c.first_user_unread_messages AS unreadMessages,
							u.first_name AS connectedUserFirstName,
							u.last_name AS connectedUserLastName
						FROM connections c
						JOIN users u ON u.user_id = c.second_user_id
						WHERE c.first_user_id = ?

						UNION

						SELECT 
							c.connection_id AS connectionId,
							c.first_user_id AS connectedUserId,
							c.second_user_order_number AS orderNumber,
							c.second_user_unread_messages AS unreadMessages,
							u.first_name AS connectedUserFirstName,
							u.last_name AS connectedUserLastName
						FROM connections c
						JOIN users u ON u.user_id = c.first_user_id
						WHERE c.second_user_id = ?
					`;
        const [rows] = await server_1.db.promise().query(secondUsersQuery, [props.userId, props.userId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Spojení úspěšně nalezeny", data: rows };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během hledání spojení" };
    }
};
exports.getConnectedUsersMod = getConnectedUsersMod;
//# sourceMappingURL=getConnectedUsersMod.js.map
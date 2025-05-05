"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectedUserMod = void 0;
const server_1 = require("../../server"); // Import připojení k DB
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getConnectedUserMod = async (props) => {
    try {
        const secondUserQuery = `
			SELECT 
				c.connection_id,
				CASE 
					WHEN c.first_user_id = ? THEN c.second_user_id
					WHEN c.second_user_id = ? THEN c.first_user_id
				END AS connectedUserId,
				CASE 
					WHEN c.first_user_id = ? THEN c.first_user_order_number
					WHEN c.second_user_id = ? THEN c.second_user_order_number
				END AS orderNumber,
				u.first_name AS connectedUserFirstName,
				u.last_name AS connectedUserLastName
			FROM connections c
			JOIN users u ON u.user_id = 
				CASE 
					WHEN c.first_user_id = ? THEN c.second_user_id
					WHEN c.second_user_id = ? THEN c.first_user_id
				END
			WHERE c.connection_id = ?
		`;
        const [rows] = await server_1.db.promise().query(secondUserQuery, [
            props.userId, // První podmínka pro first_user_id
            props.userId, // Druhá podmínka pro second_user_id
            props.userId, // Pro orderNumber první uživatel
            props.userId, // Pro orderNumber druhý uživatel
            props.userId, // Pro získání druhého uživatele v rámci první podmínky
            props.userId, // Pro získání druhého uživatele v rámci druhé podmínky
            props.connectionId, // Přidání condition pro konkrétní connectionId
        ]);
        // Pokud nebyl žádný výsledek, vrátí chybu
        if (rows.length === 0) {
            return { status: GenResEnum_1.GenEnum.NOT_FOUND, message: "Spojení nenalezeno" };
        }
        return {
            status: GenResEnum_1.GenEnum.SUCCESS,
            message: "Spojení nalezeno",
            data: rows[0],
        };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během hledání spojení" };
    }
};
exports.getConnectedUserMod = getConnectedUserMod;
//# sourceMappingURL=getConnectedUserMod.js.map
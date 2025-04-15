import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	connectionId: number;
}

interface Res {
	connectionId: number;
	connectedUserId: number;
	connectedUserFirstName: string;
	connectedUserLastName: string;
	orderNumber: number;
}

export const getConnectedUserMod = async (props: Props): Promise<GenRes<Res>> => {
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

		const [rows] = await db.promise().query<RowDataPacket[]>(secondUserQuery, [
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
			return { status: GenEnum.NOT_FOUND, message: "Spojení nenalezeno" };
		}

		return {
			status: GenEnum.SUCCESS,
			message: "Spojení nalezeno",
			data: rows[0] as Res,
		};
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během hledání spojení" };
	}
};

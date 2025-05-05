import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	connectionId: number;
}

export const changeUnreadMessagesMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		// Získáme info o připojení pro určení, zda je user první nebo druhý
		const [rows] = await db.promise().query(`SELECT first_user_id, second_user_id FROM connections WHERE connection_id = ?`, [props.connectionId]);

		if (!Array.isArray(rows) || rows.length === 0) {
			return { status: GenEnum.FAILURE, message: "Spojení nenalezeno" };
		}

		const connection = rows[0] as { first_user_id: number; second_user_id: number };

		let query = "";
		if (props.userId === connection.first_user_id) {
			query = `UPDATE connections SET first_user_unread_messages = 0 WHERE connection_id = ?`;
		} else if (props.userId === connection.second_user_id) {
			query = `UPDATE connections SET second_user_unread_messages = 0 WHERE connection_id = ?`;
		} else {
			return { status: GenEnum.FAILURE, message: "Uživatel není součástí spojení" };
		}

		await db.promise().query(query, [props.connectionId]);

		return { status: GenEnum.SUCCESS, message: "Nepřečtené zprávy označeny jako přečtené" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během označení zpráv jako přečtené" };
	}
};

import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

export const createSportMod = async (userId: number, sportName: string): Promise<GenRes<{ sportId?: number }>> => {
	const checkQuery = `SELECT sport_id FROM sports WHERE user_id = ? AND sport_name = ? LIMIT 1`;

	try {
		const [existingSport] = await db.promise().query<RowDataPacket[]>(checkQuery, [userId, sportName]);

		if (existingSport.length > 0) {
			return { status: GenEnum.ALREADY_EXISTS, message: "Sport s tímto názvem již existuje"};
		}

		const insertQuery = `
            INSERT INTO sports (user_id, sport_name, description)
            VALUES (?, ?, "Zde je vhodné napsat obecný popis sportu.")
        `;

		const [result] = await db.promise().query(insertQuery, [userId, sportName]);

		const sportId = (result as { insertId: number }).insertId;

		return { status: GenEnum.SUCCESS, message: "Sport byl úspěšně vytvořen", data: { sportId } };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření sportu"};
	}
};

import { RowDataPacket } from "mysql2";
import { db } from "../server";

export enum SportCreationStatus {
	SUCCESS = 0,
	ALREADY_EXISTS = 1,
	FAILURE = 2,
}

export const createSport = async ( userId : number, sportName: string): Promise<{ status: SportCreationStatus; sportId?: number }> => {

	const checkQuery = `SELECT sport_id FROM sports WHERE user_id = ? AND sport_name = ? LIMIT 1`;

	try {
		const [existingSport] = await db.promise().query<RowDataPacket[]>(checkQuery, [userId, sportName]);

		if (existingSport.length > 0) {
			return { status: SportCreationStatus.ALREADY_EXISTS };
		}

		const insertQuery = `
            INSERT INTO sports (user_id, sport_name)
            VALUES (?, ?)
        `;

		// Perform the insert
		const [result] = await db.promise().query(insertQuery, [userId, sportName]);

		// Get the last inserted ID (sport_id)
		const sportId = (result as { insertId: number }).insertId;

		return { status: SportCreationStatus.SUCCESS, sportId: sportId };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: SportCreationStatus.FAILURE };
	}
};

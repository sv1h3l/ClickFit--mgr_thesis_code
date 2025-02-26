import { RowDataPacket } from "mysql2";
import { db } from "../server"; // Import připojení k DB

export const getUserIdFromEmail = async (email: string): Promise<number> => {
	const query = `SELECT user_id FROM users WHERE email = ?`;

	try {
		const [results] = await db.promise().query<RowDataPacket[]>(query, [email]);
		if (results.length === 0) {
			console.error("User not found.");

			return -1; // FAILURE
		}

		return results[0].user_id; // SUCCESS
	} catch (error) {
		console.error("Database error: ", error);
		return -1; // FAILURE
	}
};

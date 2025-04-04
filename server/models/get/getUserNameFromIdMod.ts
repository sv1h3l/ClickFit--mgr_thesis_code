import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB

export const getUserNameFromIdMod = async (userId: number): Promise<string> => {
	const query = `SELECT first_name, last_name FROM users WHERE user_id = ?`;

	try {
		const [results] = await db.promise().query<RowDataPacket[]>(query, [userId]);
		if (results.length === 0) {
			console.error("User not found.");

			return ""; // FAILURE
		}

		return results[0].first_name + " " + results[0].last_name; // SUCCESS
	} catch (error) {
		console.error("Database error: ", error);
		return ""; // FAILURE
	}
};

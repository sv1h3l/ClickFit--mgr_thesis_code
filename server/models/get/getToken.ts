import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB

export const getToken = async (email: string) : Promise<string | null> => {
	const query = `
		SELECT token
		FROM users
		WHERE email = ?`;

	try {
		const [results] = await db.promise().query<RowDataPacket[]>(query, [email]);
		if (results.length === 0) {
			console.error("Nebyl nazelezen účet s emailem:", email);
			return null;
		}

		return results[0].token;
	} catch (error) {
		console.error("Database error: ", error);
		return null;
	}
};

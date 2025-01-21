import { RowDataPacket } from "mysql2";
import { db } from "../server"; // Import připojení k DB

export enum ForgottenPasswordStatus {
	ADD_TOKEN = 0,
	MODIFY_EXPIRATION = 1,
	NO_USER_FOUND = 2,
	FAILURE = 3,
}

export const forgottenPassword = async (email: string): Promise<ForgottenPasswordStatus> => {
	const query = `SELECT email, token FROM users WHERE email = ?`;

	try {
		const [results] = await db.promise().query<RowDataPacket[]>(query, [email]);
		if (results.length === 0) {
			console.error("Není v databázi uživatel s emailem:", email);
			return ForgottenPasswordStatus.NO_USER_FOUND;
		}

		const user = results[0];

		if (user.token === null) {
			return ForgottenPasswordStatus.ADD_TOKEN;
		}
		else {
			return ForgottenPasswordStatus.MODIFY_EXPIRATION;
		}

	} catch (error) {
		console.error("Database error: ", error);
		return ForgottenPasswordStatus.FAILURE;
	}
};

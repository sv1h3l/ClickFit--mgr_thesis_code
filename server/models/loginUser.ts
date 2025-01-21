import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { db } from "../server"; // Import připojení k DB

export enum LoginStatus {
	SUCCESS = 0,
	FAILURE = 1,
	USER_INACTIVE = 2,
}

export const loginUser = async (email: string, password: string): Promise<LoginStatus> => {
	const query = `SELECT email, hashed_password, is_active FROM users WHERE email = ?`;

	try {
		const [results] = await db.promise().query<RowDataPacket[]>(query, [email]);
		if (results.length === 0) {
			return LoginStatus.FAILURE; // Uživatel neexistuje nebo špatné heslo
		}

		const user = results[0];
		if (user.is_active === 0) {
			return LoginStatus.USER_INACTIVE; // Uživatel není aktivní
		}

		const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
		if (!isPasswordValid) {
			return LoginStatus.FAILURE; // Nesprávné heslo
		}

		return LoginStatus.SUCCESS;
	} catch (error) {
		console.error("Database error: ", error);
		return LoginStatus.FAILURE; // DB chyba
	}
};

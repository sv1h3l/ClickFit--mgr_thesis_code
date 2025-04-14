import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { db } from "../../server";

export enum LoginStatus {
	SUCCESS = 0,
	FAILURE = 1,
	USER_INACTIVE = 2,
}

export const loginUserMod = async (email: string, password: string): Promise<{ status: LoginStatus; authToken: number | null }> => {
	const query = `SELECT email, hashed_password, is_active, auth_token FROM users WHERE email = ?`;

	try {
		const [results] = await db.promise().query<RowDataPacket[]>(query, [email]);

		if (results.length === 0) {
			return { status: LoginStatus.FAILURE, authToken: null }; // Uživatel neexistuje
		}

		const user = results[0];

		if (user.is_active === 0) {
			return { status: LoginStatus.USER_INACTIVE, authToken: null }; // Účet není aktivní
		}

		const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

		if (!isPasswordValid) {
			return { status: LoginStatus.FAILURE, authToken: null }; // Neplatné heslo
		}

		return { status: LoginStatus.SUCCESS, authToken: user.auth_token };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: LoginStatus.FAILURE, authToken: null };
	}
};

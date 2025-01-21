import bcrypt from "bcryptjs";
import { db } from "../server"; // Import připojení k DB

export const newPassword = async (token: string, password: string): Promise<boolean> => {
	const query = `
		UPDATE users
		SET hashed_password = ?
		WHERE token = ?`;

	try {
		const results = await new Promise<any>(async (resolve, reject) => {
			const hashedPassword = await bcrypt.hash(password, 10);

			db.query(query, [hashedPassword, token], (error, results) => {
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});

		if (results.affectedRows === 0) {
			return false;
		}
		return true;
	} catch (error) {
		throw error;
	}
};

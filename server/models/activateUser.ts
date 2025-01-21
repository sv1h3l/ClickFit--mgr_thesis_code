import { db } from "../server"; // Import připojení k DB

export const activateUser = async (token: string): Promise<boolean> => {
	const query = `
		UPDATE users
		SET is_active = 1
		WHERE token = ?`;

	try {
		const results = await new Promise<any>((resolve, reject) => {
			db.query(query, [token], (error, results) => {
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

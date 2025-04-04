import { db } from "../../server"; // Import připojení k DB

export const deleteTokenMod = (token: string) => {
	return new Promise((resolve, reject) => {
		const query = `
			UPDATE users
			SET token = null, token_expires = null
			WHERE token = ?`;

		db.query(query, [token], (error, results) => {
			if (error) {
				reject(error);
			} else {
				const result = results as any; // Cast results to any to access affectedRows
				if (result.affectedRows === 0) {
					resolve(null); // Token nebyl nalezen nebo byl neplatný
				} else {
					resolve(true); // Úspěšné odstranění tokenu
				}
			}
		});
	});
};

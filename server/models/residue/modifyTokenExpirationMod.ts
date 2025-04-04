import { db } from "../../server";

export const modifyTokenExpirationMod = async (email: string) => {
	return new Promise((resolve, reject) => {
		const query = `
			UPDATE users
			SET token_expires = DATE_ADD(CURDATE(), INTERVAL 14 DAY)
			WHERE email = ?`;

		db.query(query, [email], (error, results) => {
			if (error) {
				reject(error);
			} else {
				const result = results as any;
				if (result.affectedRows === 0) {
					resolve(null);
				} else {
					resolve(true);
				}
			}
		});
		
	});
};

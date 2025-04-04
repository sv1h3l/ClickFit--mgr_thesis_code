import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { generateToken } from "../../utilities/generateToken";

export const createTokenMod = async (email: string) => {
	const token = generateToken();

	return new Promise((resolve, reject) => {
		const query = `
			UPDATE users
			SET token = ?, token_expires = NOW()
			WHERE email = ?`;

		db.query(query, [token, email], (error, results) => {
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

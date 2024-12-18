import { db } from "../server"; // Import připojení k DB
import { RowDataPacket } from "mysql2"; // Import správného typu

/** Kontrola duplicity emailu */ 
export const checkEmailDuplicity = (email: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT COUNT(*) as count FROM users WHERE email = ?
		`;

		db.query(query, [email], (error, results: RowDataPacket[]) => {
			if (error) {
				console.error("Check email dupicity error: ", error);
				reject(error);
			} else {
				const count = results[0]?.count || 0;
				resolve(count > 0); // Pokud je alespoň jeden záznam, tak je email duplicitní
			}
		});
	});
};

import bcrypt from "bcryptjs";
import { db } from "../../server";
import { generateToken } from "../../utilities/generateToken";

// Funkce pro vytvoření uživatele
export const registrateUser = (email: string, password: string, firstName: string, lastName: string): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		const query = `
            INSERT INTO users 
            (email, first_name, last_name, hashed_password, token, token_expires) 
            VALUES (?, ?, ?, ?, ?, DATE_ADD(CURDATE(), INTERVAL 14 DAY))
        `;

		const hashedPassword = await bcrypt.hash(password, 10);
		const token = generateToken(); // Generování unikátního tokenu

		db.query(query, [email, firstName, lastName, hashedPassword, token], (error, results) => {
			if (error) {
				console.log("userModel: ", error);
				reject(error);
			} else {
				console.log("userModel: ", results);

				resolve(token);
			}
		});
	});
};

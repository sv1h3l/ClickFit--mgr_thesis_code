import { db } from "../server"; // Import připojení k DB

// Funkce pro vytvoření uživatele
export const createUser = (email: string, password: string, firstName: string, lastName: string) => {
	return new Promise((resolve, reject) => {
		const query = `
      INSERT INTO users 
      (email, first_name, last_name, hashed_password) 
      VALUES (?, ?, ?, ?)
    `;

		db.query(query, [email, firstName, lastName, password], (error, results) => {
			if (error) {
				console.log("userModel: ", error);
				reject(error);
			} else {
				console.log("userModel: ", results);
				resolve(results);
			}
		});
	});
};

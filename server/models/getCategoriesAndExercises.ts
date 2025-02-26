import { db } from "../server"; // Import připojení k DB

export interface DbIntCategory {
	category_id: number;
	category_name: string;
	order_number: number;
}

export const getCategoriesAndExercises = async (sportId: number): Promise<DbIntCategory[]> => {
	try {
		// JOIN sports table with users table to get first_name and last_name
		const getCategoriesQuery = `
			SELECT 
				category_id,
				category_name,
				order_number
			FROM categories
			WHERE sport_id = ?;
		`;

		const [rows] = await db.promise().query(getCategoriesQuery, [sportId]);

		return rows as DbIntCategory[]; // Return the result as the proper type
	} catch (error) {
		console.error("Database error: ", error);
		return [];
	}
};

import { db } from "../../server"; // Import připojení k DB

interface Res { // export vymazan
	category_id: number;
	category_name: string;
	order_number: number;
}

export const getCategoriesAndExercisesMod = async (sportId: number): Promise<Res[]> => {
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

		return rows as Res[]; // Return the result as the proper type
	} catch (error) {
		console.error("Database error: ", error);
		return [];
	}
};

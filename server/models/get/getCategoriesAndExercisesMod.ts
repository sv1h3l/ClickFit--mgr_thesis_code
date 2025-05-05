import { db } from "../../server"; // Import připojení k DB

interface Res {
	// export vymazan
	category_id: number;
	category_name: string;
	order_number: number;

	description: string;

	has_repeatability: boolean;
	repeatability_quantity: number;
	loose_connection: number[];
	tight_connection: number;
	priority_points: number[];
	blacklist: number[];

	short_min_quantity: number;
	short_max_quantity: number;
	medium_min_quantity: number;
	medium_max_quantity: number;
	long_min_quantity: number;
	long_max_quantity: number;
}

export const getCategoriesAndExercisesMod = async (sportId: number): Promise<Res[]> => {
	try {
		// JOIN sports table with users table to get first_name and last_name
		const getCategoriesQuery = `
			SELECT *
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

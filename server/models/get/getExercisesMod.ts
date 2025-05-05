import { db } from "../../server"; // Import připojení k DB

export interface Res {
	exercise_id: number;
	category_id: number;
	sport_difficulty_id: number;

	name: string;
	order_number: number;
	order_number_without_categories: number;

	series: number;
	repetitions: number;
	burden: number;
	unit_code: number;

	description: string;
	youtube_link: string;

	has_repeatability: boolean;
	repeatability_quantity: number;
	loose_connection: number[];
	tight_connection: number;
	priority_points: number[];
	blacklist: number[];
}

export const getExercisesMod = async (sportId: number): Promise<Res[]> => {
	try {
		// JOIN sports table with users table to get first_name and last_name
		const getExercisesQuery = `
			SELECT *
			FROM exercises
			WHERE sport_id = ?;
		`;

		const [rows] = await db.promise().query(getExercisesQuery, [sportId]);

		return rows as Res[]; // Return the result as the proper type
	} catch (error) {
		console.error("Database error: ", error);
		return [];
	}
};

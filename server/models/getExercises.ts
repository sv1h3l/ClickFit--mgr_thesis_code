import { db } from "../server"; // Import připojení k DB

export interface DbIntExercise {
	exercise_id: number;
	category_id: number;
	sport_difficulty_id: number;

	name: string;
	order_number: number;
	description: string;
	youtube_link: string;
}

export const getExercises = async (sportId: number): Promise<DbIntExercise[]> => {
	try {
		// JOIN sports table with users table to get first_name and last_name
		const getExercisesQuery = `
			SELECT 
				exercise_id,
				category_id,
				sport_difficulty_id,
				name,
				description,
				youtube_link,
				order_number
			FROM exercises
			WHERE sport_id = ?;
		`;

		const [rows] = await db.promise().query(getExercisesQuery, [sportId]);

		return rows as DbIntExercise[]; // Return the result as the proper type
	} catch (error) {
		console.error("Database error: ", error);
		return [];
	}
};

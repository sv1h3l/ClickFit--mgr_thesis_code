import { db } from "../../server"; // Import připojení k DB

export enum GetSportsStatus {
	SUCCESS = 0,
	FAILURE = 1,
}

export interface Res {
	user_id: number;
	first_name: string;
	last_name: string;

	sport_id: number;
	sport_name: string;

	has_categories: boolean;
	has_difficulties: boolean;
	has_recommended_values: boolean;
	has_recommended_difficulty_values: boolean;

	unit_code: number;

	description: string;
}

export const getSportsMod = async (userId: number): Promise<Res[]> => {
	try {
		// JOIN sports table with users table to get first_name and last_name
		const insertCategoryQuery = `
			SELECT 
				sports.sport_id, 
				sports.user_id, 
				sports.sport_name, 
				sports.description,
				sports.has_categories,
				sports.has_difficulties,
				sports.has_recommended_values,
				sports.has_recommended_difficulty_values,
				sports.unit_code,
				users.first_name,
				users.last_name
			FROM sports
			JOIN users ON sports.user_id = users.user_id
			WHERE sports.user_id = ?;
		`;

		const [rows] = await db.promise().query(insertCategoryQuery, [userId]);

		return rows as Res[]; // Return the result as the proper type
	} catch (error) {
		console.error("Database error: ", error);
		return [];
	}
};

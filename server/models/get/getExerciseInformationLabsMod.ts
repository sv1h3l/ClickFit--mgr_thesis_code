import { db } from "../../server"; // Import připojení k DB

interface Res {
	exercise_information_labels_id: number;
	label: string;
	order_number: number;
}

export const getExerciseInformationLabsMod = async (sportId: number): Promise<Res[]> => {
	try {
		const query = `
			SELECT 
				exercise_information_labels_id,
				label,
				order_number
			FROM exercise_information_labels
			WHERE sport_id = ?;
		`;

		const [rows] = await db.promise().query(query, [sportId]);

		return rows as Res[]; // Return the result as the proper type
	} catch (error) {
		console.error("Database error: ", error);
		return [];
	}
};

import { db } from "../../server"; // Import připojení k DB

export interface DbIntExerciseInformationLabel {
	exercise_information_labels_id: number;
	label: string;
	order_number: number;
}

export const getExerciseInformationLabelsModel = async (sportId: number): Promise<DbIntExerciseInformationLabel[]> => {
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

		return rows as DbIntExerciseInformationLabel[]; // Return the result as the proper type
	} catch (error) {
		console.error("Database error: ", error);
		return [];
	}
};

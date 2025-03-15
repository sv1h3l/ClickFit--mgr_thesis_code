import { db } from "../../server"; // Import připojení k DB

export interface DbIntExerciseInformationValues {
	exercise_information_labels_id: number;
	exercise_information_value_id: number;

	value: number;
}

export const getExerciseInformationValuesModel = async (sportId: number, exerciseId: number, userId: number): Promise<DbIntExerciseInformationValues[]> => {
	try {
		const query = `
			SELECT 
				eiv.exercise_information_labels_id,
				eiv.exercise_information_value_id,
				eiv.value,
				eil.sport_id
			FROM exercise_information_values eiv
			JOIN exercise_information_labels eil
				ON eiv.exercise_information_labels_id = eil.exercise_information_labels_id
			WHERE eil.sport_id = ? 
			AND eiv.exercise_id = ? 
			AND eiv.user_id = ?;
		`;

		const [rows] = await db.promise().query(query, [sportId, exerciseId, userId]);

		return rows as DbIntExerciseInformationValues[];
	} catch (error) {
		console.error("Database error: ", error);
		return [];
	}
};

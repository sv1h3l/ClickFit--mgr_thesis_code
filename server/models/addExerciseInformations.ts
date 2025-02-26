import { Value } from "../controllers/createSportController";
import { db } from "../server";

export enum AddExerciseInformationsStatus {
	SUCCESS = 0,
	FAILURE = 1,
}

export const addExerciseInformations = async (sportId: number, exerciseInformations: Value[]): Promise<{ status: AddExerciseInformationsStatus }> => {
	try {
		for (let information of exerciseInformations) {
			const insertExersiceInfomrationQuery = `
				INSERT INTO exercise_informations (sport_id, order_number, label)
				VALUES (?, ?, ?)
			`;

			await db.promise().query(insertExersiceInfomrationQuery, [sportId, information.orderNumber, information.name]); // Insert category data
		}

		return { status: AddExerciseInformationsStatus.SUCCESS };	
	} catch (error) {
		console.error("Database error: ", error);
		return { status: AddExerciseInformationsStatus.FAILURE };
	}
};

import { Value } from "../controllers/create/createSportController-dup";
import { db } from "../server";

export enum AddSportDifficutiesStatus {
	SUCCESS = 0,
	FAILURE = 1,
}

export const addSportDifficulties = async (sportId: number, sportDifficulties: Value[]): Promise<{ status: AddSportDifficutiesStatus }> => {
	try {
		for (let difficulty of sportDifficulties) {
			const insertCategoryQuery = `
				INSERT INTO sport_difficulties (sport_id, order_number, difficulty_name)
				VALUES (?, ?, ?)
			`;

			await db.promise().query(insertCategoryQuery, [sportId, difficulty.orderNumber, difficulty.name]); // Insert difficulty data
		}

		return { status: AddSportDifficutiesStatus.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: AddSportDifficutiesStatus.FAILURE };
	}
};

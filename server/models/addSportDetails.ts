import { Value } from "../controllers/create/createSportController-dup";
import { db } from "../server";

export enum AddSportDetailsStatus {
	SUCCESS = 0,
	FAILURE = 1,
}

export const addSportDetails = async (sportId: number, sportDetails: Value[]): Promise<{ status: AddSportDetailsStatus }> => {
	try {
		for (let detail of sportDetails) {
			const insertSportDetailQuery = `
				INSERT INTO sport_details (sport_id, order_number, label)
				VALUES (?, ?, ?)
			`;

			await db.promise().query(insertSportDetailQuery, [sportId, detail.orderNumber, detail.name]); // Insert category data
		}

		return { status: AddSportDetailsStatus.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: AddSportDetailsStatus.FAILURE };
	}
};

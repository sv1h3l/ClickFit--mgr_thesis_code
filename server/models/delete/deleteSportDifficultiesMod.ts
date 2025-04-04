import { db } from "../../server";

export enum DeleteSportDifficultiesStatus {
	SUCCESS = 0,
	FAILURE = 1,
}

export const deleteSportDifficultiesMod = async (sportId: number): Promise<{ status: DeleteSportDifficultiesStatus }> => {
	try {
		const insertCategoryQuery = `DELETE FROM sport_difficulties WHERE sport_id = ?;`;

		await db.promise().query(insertCategoryQuery, [sportId]); 

		return { status: DeleteSportDifficultiesStatus.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: DeleteSportDifficultiesStatus.FAILURE };
	}
};

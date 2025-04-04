import { db } from "../../server";

export enum DeleteSportCategoriesStatus {
	SUCCESS = 0,
	FAILURE = 1,
}

export const deleteSportCategoriesMod = async (sportId: number): Promise<{ status: DeleteSportCategoriesStatus }> => {
	try {
		const insertCategoryQuery = `DELETE FROM categories WHERE sport_id = ?;`;

		await db.promise().query(insertCategoryQuery, [sportId]); 

		return { status: DeleteSportCategoriesStatus.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: DeleteSportCategoriesStatus.FAILURE };
	}
};

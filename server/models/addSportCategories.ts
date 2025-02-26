import { Value } from "../controllers/createSportController";
import { db } from "../server";

export enum AddSportCategoriesStatus {
	SUCCESS = 0,
	FAILURE = 1,
}

export const addSportCategories = async (sportId: number, sportCategories: Value[]): Promise<{ status: AddSportCategoriesStatus }> => {
	try {
		for (let category of sportCategories) {
			const insertCategoryQuery = `
				INSERT INTO categories (sport_id, order_number, category_name)
				VALUES (?, ?, ?)
			`;

			await db.promise().query(insertCategoryQuery, [sportId, category.orderNumber, category.name]); // Insert category data
		}

		return { status: AddSportCategoriesStatus.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: AddSportCategoriesStatus.FAILURE };
	}
};

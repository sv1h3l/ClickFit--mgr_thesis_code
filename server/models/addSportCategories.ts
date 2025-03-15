import { Value } from "../controllers/create/createSportController-dup";
import { db } from "../server";

export enum AddSportCategoriesStatus {
	SUCCESS = 0,
	FAILURE = 1,
}

export const addSportCategories = async (sportId: number, sportCategories: Value[]): Promise<{ status: AddSportCategoriesStatus }> => {
	try {
			const insertCategoryQuery = `
				INSERT INTO categories (sport_id, order_number, category_name)
				VALUES (?, ?, ?)
			`;

			await db.promise().query(insertCategoryQuery, [sportId, 0, "Ostatní"]); // Insert category "Ostatní" 

		for (let category of sportCategories) {
			await db.promise().query(insertCategoryQuery, [sportId, category.orderNumber, category.name]); // Insert categories
		}

		return { status: AddSportCategoriesStatus.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: AddSportCategoriesStatus.FAILURE };
	}
};

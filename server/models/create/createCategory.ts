import { RowDataPacket } from "mysql2";
import { db } from "../../server";

export enum CategoryCreationStatus {
	SUCCESS = 0,
	ALREADY_EXISTS = 1,
	FAILURE = 2,
}

export const createCategory = async (sportId: number, categoryName: string): Promise<{ status: CategoryCreationStatus; categoryId?: number }> => {
	const checkQuery = `SELECT * FROM categories WHERE sport_id = ? AND category_name = ? LIMIT 1`;

	try {
		const [existingCategory] = await db.promise().query<RowDataPacket[]>(checkQuery, [sportId, categoryName]);

		if (existingCategory.length > 0) {
			return { status: CategoryCreationStatus.ALREADY_EXISTS };
		}

		const insertQuery = `
            INSERT INTO categories (sport_id, category_name, order_number)
            VALUES (?, ?, 1)
        `;

		// Perform the insert
		const [result] = await db.promise().query(insertQuery, [sportId, categoryName]);

		const categoryId = (result as { insertId: number }).insertId; // FIXME je insertId správné ?

		return { status: CategoryCreationStatus.SUCCESS, categoryId: categoryId };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: CategoryCreationStatus.FAILURE };
	}
};

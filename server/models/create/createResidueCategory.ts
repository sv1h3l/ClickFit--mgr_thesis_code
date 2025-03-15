import { db } from "../../server";
import { GenericModelReturn } from "../GenericModelReturn";
import { GenericModelReturnEnum } from "./../GenericModelReturn";

export const createResidueCategory = async (sportId: number): Promise<GenericModelReturn<null>> => {
	try {
		const insertQuery = `
            INSERT INTO categories (sport_id, category_name, order_number)
            VALUES (?, "Ostatní", 0)
        `;

		await db.promise().query(insertQuery, [sportId]);

		return { status: GenericModelReturnEnum.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenericModelReturnEnum.FAILURE };
	}
};

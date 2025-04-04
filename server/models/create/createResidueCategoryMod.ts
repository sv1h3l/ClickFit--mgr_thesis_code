import { db } from "../../server";
import { GenRes } from "../../utilities/GenResEnum";
import { GenEnum } from "../../utilities/GenResEnum";

export const createResidueCategoryMod = async (sportId: number): Promise<GenRes<null>> => {
	try {
		const insertQuery = `
            INSERT INTO categories (sport_id, category_name, order_number)
            VALUES (?, "Ostatní", 0)
        `;

		await db.promise().query(insertQuery, [sportId]);

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE };
	}
};

import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	categoryId: number;
}

export const deleteCategoryMod = async ({ props }: { props: Props }): Promise<GenRes<null>> => {
	try {
		const query = `
            DELETE FROM categories WHERE sport_id = ? AND category_id = ?
        `;

		await db.promise().query(query, [props.sportId, props.categoryId]);

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		return { status: GenEnum.FAILURE, message: "Database error: " + error };
	}
};

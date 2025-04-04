import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	reorderCategories: { categoryId: number; orderNumber: number }[];
}

export const reorderCategoriesMod = async ({ props }: { props: Props }): Promise<GenRes<null>> => {
	try {
		props.reorderCategories.map(async (category) => {
			const query = `
				UPDATE categories
				SET order_number = ?
				WHERE sport_id = ? AND category_id = ?
			`;

			await db.promise().query(query, [category.orderNumber, props.sportId, category.categoryId]);
		});

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		return { status: GenEnum.FAILURE, message: "Database error: " + error };
	}
};

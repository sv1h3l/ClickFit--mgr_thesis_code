import { db } from "../../server";
import { GenericModelReturn, GenericModelReturnEnum } from "../GenericModelReturn";

interface ReorderCategoriesProps {
	sportId: number;
	reorderCategories: { categoryId: number; orderNumber: number }[];
}

export const reorderCategoriesModel = async ({ props }: { props: ReorderCategoriesProps }): Promise<GenericModelReturn<null>> => {
	try {
		props.reorderCategories.map(async (category) => {
			const query = `
				UPDATE categories
				SET order_number = ?
				WHERE sport_id = ? AND category_id = ?
			`;

			await db.promise().query(query, [category.orderNumber, props.sportId, category.categoryId]);
		});

		return { status: GenericModelReturnEnum.SUCCESS };
	} catch (error) {
		return { status: GenericModelReturnEnum.FAILURE, message: "Database error: " + error };
	}
};

import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	categoryId: number;

	orderNumber: number;
	orderNumberWithoutCategories?: number;
}

export const reorderExercisesMod = async ( props: Props ): Promise<GenRes<null>> => {
	try {
		const orderNumberOfCategoryQuery = `
			UPDATE exercises
			SET order_number = order_number - 1
			WHERE sport_id = ? AND category_id = ? AND order_number > ?
		`;

		await db.promise().query(orderNumberOfCategoryQuery, [props.sportId, props.categoryId, props.orderNumber]);

		if (props.orderNumberWithoutCategories) {
			const orderNumberWithoutCategoriesQuery = `
				UPDATE exercises
				SET order_number_without_categories = order_number_without_categories - 1
				WHERE sport_id = ? AND order_number_without_categories > ?
			`;

			await db.promise().query(orderNumberWithoutCategoriesQuery, [props.sportId, props.orderNumberWithoutCategories]);
		}

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		console.error("Database error: " + error)
		return { status: GenEnum.FAILURE, message: "Nastala chyba během přeuspořádávání cviků" };
	}
};

import { db } from "../../server";
import { GenericModelReturn, GenericModelReturnEnum } from "../GenericModelReturn";

interface IncrementCategoriesOrderNumberModelProps {
	sportId: number;
	categoryId: number;
}

export const incrementCategoriesOrderNumberModel = async ({ props }: { props: IncrementCategoriesOrderNumberModelProps }): Promise<GenericModelReturn<null>> => {
	try {
		// SQL dotaz pro zvýšení order_number u všech relevantních kategorií
		const query = `
			UPDATE categories
			SET order_number = order_number + 1
			WHERE sport_id = ? 
			AND category_id != ? 
			AND order_number > 0
		`;

		await db.promise().query(query, [props.sportId, props.categoryId]);

		return { status: GenericModelReturnEnum.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error);
		return {
			status: GenericModelReturnEnum.FAILURE,
			message: "Nastala chyba při zvyšování pořadí kategorií",
		};
	}
};

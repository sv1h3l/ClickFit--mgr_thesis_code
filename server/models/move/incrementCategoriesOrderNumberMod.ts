import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	categoryId: number;
}

export const incrementCategoriesOrderNumberMod = async ({ props }: { props: Props }): Promise<GenRes<null>> => {
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

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error);
		return {
			status: GenEnum.FAILURE,
			message: "Nastala chyba při zvyšování pořadí kategorií",
		};
	}
};

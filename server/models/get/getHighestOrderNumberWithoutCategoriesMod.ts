import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
}

export const getHighestOrderNumberWithoutCategoriesMod = async (props: Props): Promise<GenRes<number>> => {
	try {
		const getHighestOrderNumberWithoutCategoryQuery = `
			SELECT MAX(order_number_without_categories) AS highest_order_number_without_categories
			FROM exercises
			WHERE sport_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(getHighestOrderNumberWithoutCategoryQuery, [props.sportId]);

		const highestOrderNumberWithoutCategory = rows[0].highest_order_number_without_categories === null ? 0 : rows[0].highest_order_number_without_categories;

		return { status: GenEnum.SUCCESS, data: highestOrderNumberWithoutCategory + 1 };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Chyba při získání nejvyššího 'order_number_without_categories'" };
	}
};

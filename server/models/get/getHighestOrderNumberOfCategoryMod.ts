import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	categoryId: number;
}

export const getHighestOrderNumberOfCategoryMod = async ({ props }: { props: Props }): Promise<GenRes<number>> => {
	try {
		const getHighestOrderNumberOfCategoryQuery = `
			SELECT MAX(order_number) AS highest_order_number
			FROM exercises
			WHERE sport_id = ? AND category_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(getHighestOrderNumberOfCategoryQuery, [props.sportId, props.categoryId]);

		// Oprava návratové hodnoty - pokud není žádný výsledek, vrátíme null
		const highestOrderNumber = rows[0].highest_order_number === null ? 0 : rows[0].highest_order_number;

		return { status: GenEnum.SUCCESS, data: highestOrderNumber + 1 };
	} catch (error) {
		console.error("Database error: ", error);
		// Správný návratový status při chybě
		return { status: GenEnum.FAILURE, message: "Chyba při získání nejvyššího 'order_number'" };
	}
};

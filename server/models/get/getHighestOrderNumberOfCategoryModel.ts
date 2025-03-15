import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenericModelReturn, GenericModelReturnEnum } from "../GenericModelReturn";

interface GetHighestOrderNumberOfCategoryProps {
	sportId: number;
	categoryId: number;
}

export const getHighestOrderNumberOfCategoryModel = async ({ props }: { props: GetHighestOrderNumberOfCategoryProps }): Promise<GenericModelReturn<number>> => {
	try {
		const getHighestOrderNumberOfCategoryQuery = `
			SELECT MAX(order_number) AS highest_order_number
			FROM exercises
			WHERE sport_id = ? AND category_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(getHighestOrderNumberOfCategoryQuery, [props.sportId, props.categoryId]);

		// Oprava návratové hodnoty - pokud není žádný výsledek, vrátíme null
		const highestOrderNumber = rows[0].highest_order_number === null ? 0 : rows[0].highest_order_number;

		return { status: GenericModelReturnEnum.SUCCESS, data: highestOrderNumber+1 };
	} catch (error) {
		console.error("Database error: ", error);
		// Správný návratový status při chybě
		return { status: GenericModelReturnEnum.FAILURE, message: "Chyba při získání nejvyššího 'order_number'" };
	}
};

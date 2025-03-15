import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenericModelReturn, GenericModelReturnEnum } from "../GenericModelReturn";

interface GetResidueCategoryModel {
	sportId: number;
}

export const getResidueCategoryModel = async ({ props }: { props: GetResidueCategoryModel }): Promise<GenericModelReturn<number>> => {
	try {
		const getResidueCategoryModelQuery = `
			SELECT category_id
			FROM categories
			WHERE sport_id = ? AND order_number = 0;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(getResidueCategoryModelQuery, [props.sportId]);

		const categoryId = rows[0].category_id;

		return { status: GenericModelReturnEnum.SUCCESS, data: categoryId };
	} catch (error) {
		console.error("Database error: ", error);
		// Správný návratový status při chybě
		return { status: GenericModelReturnEnum.FAILURE, message: "Chyba při získání ID kategorie 'Ostatní'" };
	}
};

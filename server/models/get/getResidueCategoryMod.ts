import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
}

export const getResidueCategoryMod = async ({ props }: { props: Props }): Promise<GenRes<number>> => {
	try {
		const getResidueCategoryModelQuery = `
			SELECT category_id
			FROM categories
			WHERE sport_id = ? AND order_number = 0;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(getResidueCategoryModelQuery, [props.sportId]);

		const categoryId = rows[0].category_id;

		return { status: GenEnum.SUCCESS, data: categoryId };
	} catch (error) {
		console.error("Database error: ", error);
		// Správný návratový status při chybě
		return { status: GenEnum.FAILURE, message: "Chyba při získání ID kategorie 'Ostatní'" };
	}
};

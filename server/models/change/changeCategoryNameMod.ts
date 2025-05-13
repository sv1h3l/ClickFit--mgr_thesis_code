import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	categoryId: number;
	categoryName: string;
}

export const changeCategoryNameMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE categories
				SET category_name = ?
				WHERE sport_id = ? AND category_id = ?
			`;

		await db.promise().query(query, [props.categoryName, props.sportId, props.categoryId]);

		return { status: GenEnum.SUCCESS, message: "Název kategorie úspěšně změněn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny názvu kategorie" };
	}
};

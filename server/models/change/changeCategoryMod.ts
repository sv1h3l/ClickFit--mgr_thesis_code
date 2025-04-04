import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	categoryId: number;
	exerciseId: number;

	highestOrderNumber: number;
}

export const changeCategoryMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE exercises
				SET order_number = ?, category_id = ?
				WHERE sport_id = ? AND exercise_id = ?;
			`;

		await db.promise().query(query, [props.highestOrderNumber, props.categoryId, props.sportId, props.exerciseId]);

		return { status: GenEnum.SUCCESS, message: "Kategorie cviku úspešně změněna" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny kategorie cviku" };
	}
};

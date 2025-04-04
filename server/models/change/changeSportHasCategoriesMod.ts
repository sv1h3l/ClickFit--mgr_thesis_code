import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	hasCategories: boolean;
}

export const changeSportHasCategoriesMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE sports
				SET has_categories = ?
				WHERE sport_id = ?
			`;

		await db.promise().query(query, [props.hasCategories, props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Hodnota kategorií úspěšně změněna" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny kategorií sportu" };
	}
};

import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	hasRecommendedDifficultyValues: boolean;
}

export const changeSportHasRecommendedDifficultyValsMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE sports
				SET has_recommended_difficulty_values = ?
				WHERE sport_id = ?
			`;

		await db.promise().query(query, [props.hasRecommendedDifficultyValues, props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Doporučené hodnoty obtížností úspěšně změněny" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny doporučených hodnot obtížností" };
	}
};

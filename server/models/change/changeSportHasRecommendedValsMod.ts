import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	hasRecommendedValues: boolean;
}

export const changeSportHasRecommendedValsMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = props.hasRecommendedValues
			? `
				UPDATE sports
				SET has_recommended_values = ?
				WHERE sport_id = ?
			`
			: `
				UPDATE sports
				SET has_recommended_values = ?, has_recommended_difficulty_values = false
				WHERE sport_id = ?
			`;

		await db.promise().query(query, [props.hasRecommendedValues, props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Doporučené hodnoty úspěšně změněny" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny doporučených hodnot" };
	}
};

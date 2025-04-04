import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	hasDifficulties: boolean;
}

export const changeSportHasDifficultiesMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = props.hasDifficulties
			? `
				UPDATE sports
				SET has_difficulties = ?
				WHERE sport_id = ?
			`
			: `
				UPDATE sports
				SET has_difficulties = ?, has_recommended_difficulty_values = false
				WHERE sport_id = ?
			`;

		await db.promise().query(query, [props.hasDifficulties, props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Hodnota obtížností cviků úspěšně změněna" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny obtížností cviků sportu" };
	}
};

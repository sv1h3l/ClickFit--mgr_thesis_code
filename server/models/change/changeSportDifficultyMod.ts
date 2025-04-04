import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	exerciseId: number;
	sportDifficultyId: number;
}

export const changeSportDifficultyMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE exercises
				SET sport_difficulty_id = ?
				WHERE sport_id = ? AND exercise_id = ?;
			`;

		await db.promise().query(query, [props.sportDifficultyId, props.sportId, props.exerciseId]);

		return { status: GenEnum.SUCCESS, message: "Obtížnost cviku úspešně změněna" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny obtížnosti cviku" };
	}
};

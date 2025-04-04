import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	sportDifficultyId: number;
	newSportDifficultyId: number;
}

export const changeExercisesDifficultyMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE exercises
				SET sport_difficulty_id = ?
				WHERE sport_id = ? AND sport_difficulty_id = ?
			`;

		await db.promise().query(query, [props.newSportDifficultyId, props.sportId, props.sportDifficultyId]);

		return { status: GenEnum.SUCCESS, message: "Obtížnost cviku úspěšně změněna" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny obtížnosti cviku" };
	}
};

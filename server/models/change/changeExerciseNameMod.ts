import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	exerciseId: number;
	exerciseName: string;
}

export const changeExerciseNameMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE exercises
				SET name = ?
				WHERE sport_id = ? AND exercise_id = ?
			`;

		await db.promise().query(query, [props.exerciseName, props.sportId, props.exerciseId]);

		return { status: GenEnum.SUCCESS, message: "Název cviku úspěšně změněn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny názvu cviku" };
	}
};

import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	exerciseId: number;

	description: string;
}

export const changeExerciseDescMod = async ({ sportId, exerciseId, description }: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE exercises
				SET description = ?
				WHERE sport_id = ? AND exercise_id = ?
			`;

		await db.promise().query(query, [description, sportId, exerciseId]);

		return { status: GenEnum.SUCCESS, message: "Popis cviku úspěšně změněn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny popisu cviku" };
	}
};

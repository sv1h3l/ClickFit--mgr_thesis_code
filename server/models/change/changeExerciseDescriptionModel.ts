import { db } from "../../server";
import { GenericModelReturn, GenericModelReturnEnum } from "../GenericModelReturn";

interface ChangeExerciseDescriptionModelProps {
	sportId: number;
	exerciseId: number;

	description: string;
}

export const changeExerciseDescriptionModel = async ({ sportId, exerciseId, description }: ChangeExerciseDescriptionModelProps): Promise<GenericModelReturn<null>> => {
	try {
		const query = `
				UPDATE exercises
				SET description = ?
				WHERE sport_id = ? AND exercise_id = ?
			`;

		await db.promise().query(query, [description, sportId, exerciseId]);

		return { status: GenericModelReturnEnum.SUCCESS, message: "Popis cviku úspěšně změněn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenericModelReturnEnum.FAILURE, message: "Nastala chyba během změny popisu cviku" };
	}
};

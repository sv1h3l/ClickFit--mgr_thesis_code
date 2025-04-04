import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	categoryId: number;

	highestOrderNumber: number;
	exercisesOfCategory: { exerciseId: number }[];
}

export const transferExercisesMod = async ({ props }: { props: Props }): Promise<GenRes<null>> => {
	try {
		let highestOrderNumber = props.highestOrderNumber;

		for (const exercise of props.exercisesOfCategory) {
			const query = `
				UPDATE exercises
				SET category_id = ?, order_number = ?
				WHERE sport_id = ? AND exercise_id = ?
			`;

			await db.promise().query(query, [props.categoryId, highestOrderNumber, props.sportId, exercise.exerciseId]);

			highestOrderNumber = highestOrderNumber + 1;
		}

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error); // FIXME udělat logování u ostatních modelů, aby nebyly předávány error skrze message ale vypsala se do console.error
		return { status: GenEnum.FAILURE, message: "Nastala chyba během přesouvání cviků z odstraňované kategorie" };
	}
};

import { db } from "../../server";
import { GenericModelReturn, GenericModelReturnEnum } from "../GenericModelReturn";

interface transferExercisesProps {
	sportId: number;
	categoryId: number;

	highestOrderNumber: number;
	exercisesOfCategory: { exerciseId: number }[];
}

export const transferExercisesModel = async ({ props }: { props: transferExercisesProps }): Promise<GenericModelReturn<null>> => {
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

		return { status: GenericModelReturnEnum.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error); // FIXME udělat logování u ostatních modelů, aby nebyly předávány error skrze message ale vypsala se do console.error
		return { status: GenericModelReturnEnum.FAILURE, message: "Nastala chyba během přesouvání cviků z odstraňované kategorie" };
	}
};

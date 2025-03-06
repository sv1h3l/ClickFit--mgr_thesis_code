import { db } from "../server";
import { GenericModelReturn, GenericModelReturnEnum } from "./GenericModelReturn";

interface ReorderExercisesProps {
	sportId: number;
	reorderExercises: { exerciseId: number; orderNumber: number }[];
}

export const reorderExercisesModel = async ({ props }: { props: ReorderExercisesProps }): Promise<GenericModelReturn<null>> => {
	try {
		props.reorderExercises.map(async (exercise) => {
			const query = `
				UPDATE exercises
				SET order_number = ?
				WHERE sport_id = ? AND exercise_id = ?
			`;

			await db.promise().query(query, [exercise.orderNumber, props.sportId, exercise.exerciseId]);
		});

		return { status: GenericModelReturnEnum.SUCCESS };
	} catch (error) {
		return { status: GenericModelReturnEnum.FAILURE, message: "Database error: " + error };
	}
};

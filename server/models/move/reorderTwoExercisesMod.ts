import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	hasCategories: boolean;

	reorderExercises: { exerciseId: number; orderNumber: number }[];
}

export const reorderTwoExercisesMod = async ({ props }: { props: Props }): Promise<GenRes<null>> => {
	try {
		for (const exercise of props.reorderExercises) {
			const query = `
				UPDATE exercises
				SET ${props.hasCategories ? "order_number" : "order_number_without_categories"} = ?
				WHERE sport_id = ? AND exercise_id = ? 
			`;

			await db.promise().query(query, [exercise.orderNumber, props.sportId, exercise.exerciseId]);
		}

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		return { status: GenEnum.FAILURE, message: "Database error: " + error };
	}
};

import { db } from "../../server";
import { GenericModelReturn, GenericModelReturnEnum } from "../GenericModelReturn";

interface DeleteExerciseProps {
	sportId: number;
	exerciseId: number;
}

export const deleteExerciseModel = async ({ props }: { props: DeleteExerciseProps }): Promise<GenericModelReturn<null>> => {
	try {
		const query = `
            DELETE FROM exercises WHERE sport_id = ? AND exercise_id = ?
        `;

		await db.promise().query(query, [props.sportId, props.exerciseId]);

		return { status: GenericModelReturnEnum.SUCCESS };
	} catch (error) {
		return { status: GenericModelReturnEnum.FAILURE, message: "Database error: " + error };
	}
};

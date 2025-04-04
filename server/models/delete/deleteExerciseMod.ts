import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	exerciseId: number;
}

export const deleteExerciseMod = async ({ props }: { props: Props }): Promise<GenRes<null>> => {
	try {
		const query = `
            DELETE FROM exercises WHERE sport_id = ? AND exercise_id = ?
        `;

		await db.promise().query(query, [props.sportId, props.exerciseId]);

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		return { status: GenEnum.FAILURE, message: "Database error: " + error };
	}
};

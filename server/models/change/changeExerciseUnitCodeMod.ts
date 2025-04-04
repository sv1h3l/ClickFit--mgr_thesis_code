import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	exerciseId: number;

	unitCode: number;
}

export const changeExerciseUnitCodeMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE exercises
				SET unit_code = ?
				WHERE sport_id = ? AND exercise_id = ?
			`;

		await db.promise().query(query, [props.unitCode, props.sportId, props.exerciseId]);

		return { status: GenEnum.SUCCESS, message: "Jednotka cviku úspěšně změněna" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny jednotky cviku" };
	}
};

import { db } from "../../server"; // Import připojení k DB
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	exerciseId: number;
}

interface Res {
	exercise_difficulty_id: number;
	sport_difficulty_id: number;

	series: number;
	repetitions: number;
	burden: number;
}

export const getExerciseDifficultiesMod = async (props: Props): Promise<GenRes<Res[]>> => {
	try {
		const query = `
			SELECT 
				exercise_difficulty_id,
				sport_difficulty_id,
				series,
				repetitions,
				burden
			FROM exercise_difficulties 
			WHERE exercise_id = ?;
		`;

		const [rows] = await db.promise().query(query, [props.exerciseId]);

		return { status: GenEnum.SUCCESS, message: "Obtížnosti cviku úspěšně předány", data: rows as Res[] };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání obtížností cviku" };
	}
};

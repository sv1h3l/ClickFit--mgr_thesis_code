import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
}

interface Res {
	exercise_difficulty_id: number;
	exercise_id: number;
	sport_difficulty_id: number;

	series: number;
	repetitions: number;
	burden: number;

	orderNumber: number;
}

export const getAllExerciseDifficultiesMod = async (props: Props): Promise<GenRes<Res[]>> => {
	try {
		const query = `
			SELECT 
				ed.exercise_difficulty_id,
				ed.sport_difficulty_id,
				ed.exercise_id,
				ed.series,
				ed.repetitions,
				ed.burden,
				sd.order_number
			FROM exercise_difficulties ed
			JOIN sport_difficulties sd ON ed.sport_difficulty_id = sd.sport_difficulty_id
			WHERE sd.sport_id = ?;
		`;

		const [rows] = await db.promise().query(query, [props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Všechny obtížnosti cviků úspěšně předány", data: rows as Res[] };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání všech obtížností cviků" };
	}
};

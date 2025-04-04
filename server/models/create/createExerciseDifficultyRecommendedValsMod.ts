import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportDifficultyId: number;
	exerciseId: number;

	series: number;
	repetitions: number;
	burden: number;
}

export const createExerciseDifficultyRecommendedValsMod = async (props: Props): Promise<GenRes<number>> => {
	const checkQuery = `SELECT * FROM exercise_difficulties WHERE sport_difficulty_id = ? AND exercise_id = ? LIMIT 1`;

	try {
		const [existingDiffictuly] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.sportDifficultyId, props.exerciseId]);

		if (existingDiffictuly.length > 0) {
			return { status: GenEnum.ALREADY_EXISTS, message: "Obtížnost cviku již existuje" };
		}

		const query = `
				INSERT INTO exercise_difficulties (sport_difficulty_id, exercise_id, series, repetitions, burden)
				VALUES (?, ?, ?, ?, ?)
			`;

		const [result] = await db.promise().query<ResultSetHeader>(query, [props.sportDifficultyId, props.exerciseId, props.series, props.repetitions, props.burden]);

		return { status: GenEnum.SUCCESS, message: "Obtížnost cviku úspěšně vytvořena", data: result.insertId };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření obtížnosti cviku" };
	}
};

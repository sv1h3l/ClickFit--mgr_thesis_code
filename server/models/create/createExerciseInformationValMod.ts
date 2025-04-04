import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	exerciseInformationLabelId: number;
	exerciseId: number;
	userId: number;

	exerciseInformationValue: string;
}

export const createExerciseInformationValMod = async (props: Props): Promise<GenRes<number>> => {
	const checkQuery = `SELECT exercise_information_value_id FROM exercise_information_values
						WHERE exercise_information_labels_id = ? AND user_id = ? AND exercise_id = ?
						LIMIT 1`;

	try {
		const [exist] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.exerciseInformationLabelId, props.userId, props.exerciseId]);

		if (exist.length > 0) {
			return { status: GenEnum.ALREADY_EXISTS, data: exist[0].exercise_information_value_id };
		}

		const query = `
				INSERT INTO exercise_information_values (exercise_information_labels_id, user_id, exercise_id, value)
				VALUES (?, ?, ?, ?)
			`;

		const [result] = await db.promise().query<ResultSetHeader>(query, [props.exerciseInformationLabelId, props.userId, props.exerciseId, props.exerciseInformationValue]);

		return { status: GenEnum.SUCCESS, message: "Informace o cviku úspěšně vytvořena", data: result.insertId };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření informace o cviku" };
	}
};

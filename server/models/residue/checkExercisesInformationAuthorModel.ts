import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenericModelReturn, GenericModelReturnEnum } from "../GenericModelReturn";

export const checkExercisesInformationAuthorModel = async (userId: number, id: number): Promise<GenericModelReturn<null>> => {
	const checkQuery = `SELECT * FROM exercise_information_values WHERE user_id = ? AND exercise_information_value_id = ? LIMIT 1`;

	try {
		const [authorizedPerson] = await db.promise().query<RowDataPacket[]>(checkQuery, [userId, id]);

		if (authorizedPerson.length > 0) {
			return { status: GenericModelReturnEnum.SUCCESS };
		}

		return { status: GenericModelReturnEnum.FAILURE };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenericModelReturnEnum.FAILURE };
	}
};

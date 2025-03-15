import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenericModelReturn, GenericModelReturnEnum } from "../GenericModelReturn";

export const checkSportAuthorModel = async (userId: number, id: number): Promise<GenericModelReturn<null>> => {
	const checkQuery = `SELECT * FROM sports WHERE user_id = ? AND sport_id = ? LIMIT 1`;

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

import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

export const checkSportAuthorMod = async (userId: number, id: number): Promise<GenRes<null>> => {
	const checkQuery = `SELECT * FROM sports WHERE user_id = ? AND sport_id = ? LIMIT 1`;

	try {
		const [authorizedPerson] = await db.promise().query<RowDataPacket[]>(checkQuery, [userId, id]);

		if (authorizedPerson.length > 0) {
			return { status: GenEnum.SUCCESS };
		}

		return { status: GenEnum.FAILURE };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE };
	}
};

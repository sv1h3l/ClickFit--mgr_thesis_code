import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	sportName: string;
}

export const checkSportNameExistenceMod = async (props : Props): Promise<GenRes<null>> => {
	const checkQuery = `SELECT * FROM sports WHERE user_id = ? AND sport_name = ? LIMIT 1`;

	try {
		const [authorizedPerson] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.userId, props.sportName]);

		if (authorizedPerson.length > 0) {
			return { status: GenEnum.ALREADY_EXISTS, message: "Sport s tímto názvem již existuje" };
		}

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE };
	}
};

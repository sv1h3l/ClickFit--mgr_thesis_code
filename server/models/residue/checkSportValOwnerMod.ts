import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props{
	userId: number,
	valId: number,
}

export const checkSportValOwnerMod = async (props : Props): Promise<GenRes<null>> => {
	const checkQuery = `SELECT * FROM sport_detail_values WHERE user_id = ? AND sport_detail_value_id = ? LIMIT 1`;

	try {
		const [authorizedPerson] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.userId, props.valId]);

		if (authorizedPerson.length > 0) {
			return { status: GenEnum.SUCCESS };
		}

		return { status: GenEnum.FAILURE };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE };
	}
};

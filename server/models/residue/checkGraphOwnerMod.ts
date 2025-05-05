import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props{
	userId: number,
	graphId: number,
}

export const checkGraphOwnerMod = async (props : Props): Promise<GenRes<null>> => {
	const checkQuery = `SELECT * FROM user_graphs WHERE user_id = ? AND graph_id = ? LIMIT 1`;

	try {
		const [authorizedPerson] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.userId, props.graphId]);

		if (authorizedPerson.length > 0) {
			return { status: GenEnum.SUCCESS };
		}

		return { status: GenEnum.FAILURE };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE };
	}
};

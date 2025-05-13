import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	firstUserId: number;
	secondUserId: number;
}

export const checkExistingConnectionMod = async (props: Props): Promise<GenRes<{ connectionId: number }>> => {
	const checkQuery = `
					SELECT connection_id FROM connections
					WHERE (first_user_id = ? AND second_user_id = ?) OR (first_user_id = ? AND second_user_id = ?) LIMIT 1
				`;

	try {
		const [rows] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.firstUserId, props.secondUserId, props.secondUserId, props.firstUserId]);

		if (rows.length > 0) {
			return { status: GenEnum.ALREADY_EXISTS, message: "Spojení je již navázáno", data: { connectionId: rows[0].connection_id } };
		}

		return { status: GenEnum.SUCCESS, message: "Spojení ještě není navázáno" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během kontroly navázaného spojení" };
	}
};

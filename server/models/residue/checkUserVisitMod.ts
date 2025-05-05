import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	visitedUserId: number;
}

export const checkUserVisitMod = async (props: Props): Promise<GenRes<null>> => {
	const checkQuery = `
		SELECT connection_id FROM connections
		WHERE 
			(first_user_id = ? AND second_user_id = ?)
			OR
			(first_user_id = ? AND second_user_id = ?)
		LIMIT 1
	`;

	try {
		const [rows] = await db
			.promise()
			.query<RowDataPacket[]>(checkQuery, [
				props.userId,
				props.visitedUserId,
				props.visitedUserId,
				props.userId,
			]);

		if (rows.length > 0) {
			return { status: GenEnum.SUCCESS };
		}

		return { status: GenEnum.FAILURE };
	} catch (error) {
		console.error("Database error:", error);
		return { status: GenEnum.FAILURE };
	}
};

import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	diaryId: number;
	userId: number;
}

export const checkDiaryAuthorMod = async (props: Props): Promise<GenRes<null>> => {
	const checkQuery = `SELECT * FROM diaries WHERE user_id = ? AND diary_id = ? LIMIT 1`;

	try {
		const [authorizedPerson] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.userId, props.diaryId]);

		if (authorizedPerson.length > 0) {
			return { status: GenEnum.SUCCESS };
		}

		return { status: GenEnum.FAILURE };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE };
	}
};

import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	userId: number;
}

interface Res {
	diary_id: number;
	sport_id: number;
	content: string;
}

export const getDiaryMod = async (props: Props): Promise<GenRes<Res>> => {
	try {
		const query = `
			SELECT 
				diary_id,
				sport_id,
				content
			FROM diaries
			WHERE sport_id = ? AND user_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.sportId, props.userId]);

		if (rows.length === 0) {
			return { status: GenEnum.NOT_FOUND, message: "Deník nebyl nalezen" };
		}

		return { status: GenEnum.SUCCESS, message: "Deník úspěšně předán", data: rows[0] as Res };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání deníku" };
	}
};

import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
}

interface Res {
	highestOrderNumber: number;
}

export const getHighestGraphsOrderNumberMod = async (props: Props): Promise<GenRes<Res>> => {
	try {
		const query = `
			SELECT COUNT(*) AS count
			FROM user_graphs
			WHERE user_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.userId]);
		const count = rows[0]?.count ?? 0;

		return {
			status: GenEnum.SUCCESS,
			message: "Počet uživatelských grafů úspěšně získán",
			data: { highestOrderNumber: count },
		};
	} catch (error) {
		console.error("Database error: " + error);
		return {
			status: GenEnum.FAILURE,
			message: "Nastala chyba během získávání uživatelských grafů",
		};
	}
};

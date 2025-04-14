import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	graphId: number;

	isDefaultGraphValue: boolean;
}

interface Res {
	highestOrderNumber: number;
}

export const getHighestGraphValuesOrderNumberMod = async (props: Props): Promise<GenRes<Res>> => {
	try {
		const query = `
			SELECT COUNT(*) AS count
			FROM graph_values
			WHERE user_id = ? AND graph_id = ? AND is_default_graph_value = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.userId, props.graphId, props.isDefaultGraphValue]);
		const count = rows[0]?.count ?? 0;

		return {
			status: GenEnum.SUCCESS,
			message: "Počet hodnot grafu úspěšně získán",
			data: { highestOrderNumber: count },
		};
	} catch (error) {
		console.error("Database error: " + error);
		return {
			status: GenEnum.FAILURE,
			message: "Nastala chyba během získávání počtu hodnot grafu",
		};
	}
};

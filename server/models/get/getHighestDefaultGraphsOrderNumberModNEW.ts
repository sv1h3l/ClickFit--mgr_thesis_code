import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
}

interface Res {
	highestOrderNumber: number;
}

export const getHighestDefaultGraphsOrderNumberModNEW = async (props: Props): Promise<GenRes<Res>> => {
	try {
		const query = `
			SELECT COUNT(*) AS count
			FROM default_graphs_order_numbers
			WHERE user_id = ? AND order_number != 0;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.userId]);
		const count = rows[0]?.count ?? 0;

		return {
			status: GenEnum.SUCCESS,
			message: "Počet výchozích grafů s nenulovým pořadím úspěšně získán",
			data: { highestOrderNumber: count },
		};
	} catch (error) {
		console.error("Database error: " + error);
		return {
			status: GenEnum.FAILURE,
			message: "Nastala chyba během získávání výchozích grafů s nenulovým pořadím",
		};
	}
};

import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
}

interface Res {
	highestOrderNumber: number;
}

export const getHighestDefaultGraphsOrderNumberMod = async (props: Props): Promise<GenRes<Res>> => {
	try {
		const query = `
			SELECT 
				default_graph_order_number_id,
				order_number
			FROM default_graphs_order_numbers
			WHERE user_id = ? ;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.userId]);

		return { status: GenEnum.SUCCESS, message: "Nejvyšší pořadí výchozího grafu úspěšně předáno", data: { highestOrderNumber: rows.length } };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání nejvyššího pořádí výchozího grafu" };
	}
};

import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	graphId: number;
}

interface Res {
	default_graph_order_number_id: number;

	order_number: number;
}

export const getDefaultGraphOrderNumberMod = async (props: Props): Promise<GenRes<Res>> => {
	try {
		const query = `
			SELECT 
				default_graph_order_number_id,
				order_number
			FROM default_graphs_order_numbers
			WHERE user_id = ? AND graph_id = ? LIMIT 1;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [ props.userId, props.graphId]);

		if (rows.length === 0) {
			return { status: GenEnum.NOT_FOUND, message: "Pořadí výchozího grafu nebylo nalezeno" };
		}

		return { status: GenEnum.SUCCESS, message: "Pořadí výchozího grafu úspěšně předáno", data: rows[0] as Res };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání pořádí výchozího grafu" };
	}
};

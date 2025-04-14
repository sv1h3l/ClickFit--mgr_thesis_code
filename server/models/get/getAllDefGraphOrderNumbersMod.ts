import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;
}

interface Res {
	default_graph_order_number_id: number;
	user_id: number;
	order_number: number;
}

export const getAllDefGraphOrderNumbersMod = async (props: Props): Promise<GenRes<Res[]>> => {
	try {
		const query = `
			SELECT * FROM default_graphs_order_numbers
			WHERE graph_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.graphId]);

		return { status: GenEnum.SUCCESS, message: "Pořadí výchozího grafu úspěšně předáno", data: rows as Res[] };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání pořádí výchozího grafu" };
	}
};

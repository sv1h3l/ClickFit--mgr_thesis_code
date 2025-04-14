import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;
	orderNumber: number;
}

export const moveDefGraphMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const firstQuery = `
				UPDATE default_graphs_order_numbers
				SET order_number = order_number + ?
				WHERE default_graph_order_number_id = ?
			`;

		db.promise().query<ResultSetHeader>(firstQuery, [props.orderNumber, props.graphId]);

		return { status: GenEnum.SUCCESS, message: "Pořadí výchozího grafu úspěšně změněno" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny pořadí výchozího grafu" };
	}
};

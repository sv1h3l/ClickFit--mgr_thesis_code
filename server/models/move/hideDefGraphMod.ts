import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	defGraphId: number;
	sportId: number;

	orderNumber: number;
}

export const hideDefGraphMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const hideQuery = `
				UPDATE default_graphs_order_numbers
				SET order_number = 0
				WHERE default_graph_order_number_id = ?
			`;

		await db.promise().query<ResultSetHeader>(hideQuery, [props.defGraphId]);

		const reorderGraphsQuery = `
				UPDATE user_graphs
				SET order_number = order_number - 1
				WHERE sport_id = ? AND order_number > ?
			`;

		await db.promise().query<ResultSetHeader>(reorderGraphsQuery, [props.sportId, props.orderNumber]);

		const reorderDefGraphsQuery = `
				UPDATE default_graphs_order_numbers dgo
				JOIN default_graphs dg ON dgo.graph_id = dg.graph_id
				SET dgo.order_number = dgo.order_number - 1
				WHERE dg.sport_id = ? AND dgo.order_number > ?;
			`;

		await db.promise().query<ResultSetHeader>(reorderDefGraphsQuery, [props.sportId, props.orderNumber]);

		return { status: GenEnum.SUCCESS, message: "Výchozí graf úspěšně skryt" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během skrytí výchozího grafu" };
	}
};

import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	defGraphId: number;

	orderNumber: number;
}

export const showDefGraphMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE default_graphs_order_numbers
				SET order_number = ?
				WHERE default_graph_order_number_id = ?
			`;

		db.promise().query<ResultSetHeader>(query, [props.orderNumber, props.defGraphId]);

		return { status: GenEnum.SUCCESS, message: "Výchozí graf úspěšně zobrazen" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během zobrazení výchozího grafu" };
	}
};

import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;

	orderNumber: number;
}

export const reorderGraphsMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const userGraphsQuery = `
			UPDATE user_graphs
			SET order_number = order_number - 1
			WHERE order_number > ? AND user_id = ?
		`;

		await db.promise().query(userGraphsQuery, [props.orderNumber, props.userId]);

		const defGraphsQuery = `
			UPDATE default_graphs_order_numbers
			SET order_number = order_number - 1
			WHERE order_number > ? AND user_id = ?
		`;

		await db.promise().query(defGraphsQuery, [props.orderNumber, props.userId]);

		return { status: GenEnum.SUCCESS, message: "Záznamy úspěšně přeuspořádány" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během přeuspořádávání záznamů grafu" };
	}
};

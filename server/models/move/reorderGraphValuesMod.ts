import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;
	orderNumber: number;
}

export const reorderGraphValuesMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
			UPDATE graph_values
			SET order_number = order_number - 1
			WHERE graph_id = ? AND order_number > ?
		`;

		await db.promise().query(query, [props.graphId, props.orderNumber]);

		return { status: GenEnum.SUCCESS, message: "Záznamy úspěšně přeuspořádányn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během přeuspořádávání záznamů grafu" };
	}
};

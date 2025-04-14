import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;
	orderNumber: number;
}

export const reorderGraphsWhenDeletedGrafIsDefMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
			UPDATE user_graphs
			SET order_number = order_number - 1
			WHERE order_number > ?
		`;

		await db.promise().query(query, [props.graphId, props.orderNumber]);

		return { status: GenEnum.SUCCESS, message: "Záznamy úspěšně přeuspořádány" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během přeuspořádávání záznamů grafu" };
	}
};

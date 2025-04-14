import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;
	orderNumber: number;
}

export const moveGraphMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const firstQuery = `
				UPDATE user_graphs
				SET order_number = order_number + ?
				WHERE graph_id = ?
			`;

		db.promise().query<ResultSetHeader>(firstQuery, [props.orderNumber, props.graphId]);

		return { status: GenEnum.SUCCESS, message: "Pořadí grafu úspěšně změněno" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny pořadí grafu" };
	}
};

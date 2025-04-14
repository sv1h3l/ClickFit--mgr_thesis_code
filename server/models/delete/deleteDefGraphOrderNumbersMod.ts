import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;
}

export const deleteDefGraphOrderNumbersMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
            DELETE FROM default_graphs_order_numbers
			WHERE graph_id = ?
        `;

		await db.promise().query(query, [props.graphId]);

		return { status: GenEnum.SUCCESS, message: "Pořadí výchozího grafu úspěšně smazán" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během mazání pořadí výchozího grafu" };
	}
};

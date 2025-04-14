import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;

	isDefGraph: boolean;
}

export const deleteAllGraphValuesMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
            DELETE FROM graph_values
			WHERE graph_id = ? AND is_default_graph_value = ?
        `;

		await db.promise().query(query, [props.graphId, props.isDefGraph]);

		return { status: GenEnum.SUCCESS, message: "Záznamy grafu úspěšně smazány" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během mazání záznamů grafu" };
	}
};

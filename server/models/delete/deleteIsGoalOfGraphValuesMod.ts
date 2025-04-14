import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;

	isDefGraph: boolean;
}

export const deleteIsGoalOfGraphValuesMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
			UPDATE graph_values
			SET	is_goal = 0 
			WHERE graph_id = ? AND is_default_graph_value = ?
		`;

		await db.promise().query<ResultSetHeader>(query, [props.graphId, props.isDefGraph]);

		return { status: GenEnum.SUCCESS, message: "Cíle záznamů grafu úspěšně smazány" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během mazání cílů záznamů grafu" };
	}
};

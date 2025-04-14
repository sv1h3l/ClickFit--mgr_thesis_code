import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;

	formattedDate: string;

	isDefGraph: boolean;
}

export const changeXAxisDateGraphValuesMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
			UPDATE graph_values
			SET	x_axis_value = ? 
			WHERE graph_id = ? AND is_default_graph_value = ?
		`;

		await db.promise().query<ResultSetHeader>(query, [props.formattedDate, props.graphId, props.isDefGraph]);

		return { status: GenEnum.SUCCESS, message: "Záznamy grafu úspěšně změneny" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny záznamů grafu" };
	}
};

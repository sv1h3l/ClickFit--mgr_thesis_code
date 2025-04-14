import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;

	graphLabel: string;

	hasDate: boolean;
	xAxisLabel: string;
	yAxisLabel: string;

	hasGoals: boolean;

	unit: string;

	isDefGraph: boolean;
}

export const changeGraphMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
			UPDATE ${props.isDefGraph ? "default_graphs" : "user_graphs"}
			SET	graph_label = ?,
				has_date = ?,
				y_axis_label = ?,
				x_axis_label = ?,
				unit = ?,
				has_goals = ?
			WHERE graph_id = ?
		`;

		await db.promise().query<ResultSetHeader>(query, [props.graphLabel, props.hasDate, props.yAxisLabel, props.xAxisLabel, props.unit, props.hasGoals, props.graphId]);

		return { status: GenEnum.SUCCESS, message: "Graf úspěšně změnen" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny grafu" };
	}
};

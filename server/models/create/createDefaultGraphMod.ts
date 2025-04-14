import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;

	graphLabel: string;

	hasDate: boolean;
	xAxisLabel: string;
	yAxisLabel: string;

	hasGoals: boolean;

	unit: string;
}

export const createDefaultGraphMod = async (props: Props): Promise<GenRes<{ graphId: number }>> => {
	try {
		const query = `
			INSERT INTO default_graphs (
				sport_id, graph_label,
				x_axis_label, y_axis_label, has_date,
				unit, has_goals
			)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`;

		const [result] = await db.promise().query<ResultSetHeader>(query, [props.sportId, props.graphLabel, props.xAxisLabel, props.yAxisLabel, props.hasDate, props.unit, props.hasGoals]);

		return { status: GenEnum.SUCCESS, message: "Výchozí graf úspěšně vytvořen", data: { graphId: result.insertId } };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření výchozího grafu" };
	}
};

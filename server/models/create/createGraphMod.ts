import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	userId: number;

	graphLabel: string;
	orderNumber: number;

	hasDate: boolean;
	xAxisLabel: string;
	yAxisLabel: string;

	hasGoals: boolean;

	unit: string;
}

export const createGraphMod = async (props: Props): Promise<GenRes<{ graphId: number }>> => {
	try {
		const query = `
			INSERT INTO user_graphs (
				sport_id, graph_label, user_id,
				x_axis_label, y_axis_label, has_date,
				order_number, unit, has_goals
			)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;

		const [result] = await db.promise().query<ResultSetHeader>(query, [props.sportId, props.graphLabel, props.userId, props.xAxisLabel, props.yAxisLabel, props.hasDate, props.orderNumber, props.unit, props.hasGoals]);

		return { status: GenEnum.SUCCESS, message: "Uživatelský graf úspěšně vytvořen", data: { graphId: result.insertId } };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření uživatelského grafu" };
	}
};

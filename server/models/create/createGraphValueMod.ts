import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;
	userId: number;

	yAxisValue: number;
	xAxisValue: string;

	orderNumber: number;

	isGoal: boolean;
	isDefaultGraphValue: boolean;
}

export const createGraphValueMod = async (props: Props): Promise<GenRes<{ graphValueId: number }>> => {
	try {
		const query = `
			INSERT INTO graph_values (
				graph_id, user_id, is_default_graph_value, y_axis_value, x_axis_value, order_number, is_goal
			)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`;

		const [result] = await db.promise().query<ResultSetHeader>(query, [props.graphId, props.userId, props.isDefaultGraphValue, props.yAxisValue, props.xAxisValue, props.orderNumber, props.isGoal]);

		return { status: GenEnum.SUCCESS, message: "Záznam grafu úspěšně vytvořen", data: { graphValueId: result.insertId } };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření uživatelského grafu" };
	}
};

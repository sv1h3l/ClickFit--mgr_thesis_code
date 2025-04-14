import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphValueId: number;

	yAxisValue: number;
	xAxisValue: string;
}

export const changeGraphValueMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE graph_values
				SET y_axis_value = ?, x_axis_value = ?
				WHERE graph_value_id = ?
			`;

		const [result] = await db.promise().query<ResultSetHeader>(query, [props.yAxisValue, props.xAxisValue, props.graphValueId]);

		return { status: GenEnum.SUCCESS, message: "Záznam grafu úspěšně vytvořen" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření uživatelského grafu" };
	}
};

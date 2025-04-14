import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;
	userId: number;

	defaultGraph: boolean;
}

interface Res {
	graph_value_id: number;

	y_axis_value: number;
	x_axis_value: string;

	is_goal: boolean;

	order_number: number;
}

export const getGraphValuesMod = async (props: Props): Promise<GenRes<Res[]>> => {
	try {
		const query = `
			SELECT * FROM graph_values
			WHERE graph_id = ? AND is_default_graph_value = ? AND user_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.graphId, props.defaultGraph, props.userId]);

		if (rows.length === 0) {
			return { status: GenEnum.NOT_FOUND, message: "Hodnoty grafů nebyly nalezeny" };
		}

		return { status: GenEnum.SUCCESS, message: "Hodnoty grafů úspěšně předány", data: rows as Res[] };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání hodnot grafů" };
	}
};

import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphValueId: number;
	isGoal: boolean;
}

export const changeGoalGraphValueMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE graph_values
				SET is_goal = ?
				WHERE graph_value_id = ?
			`;

		const [result] = await db.promise().query<ResultSetHeader>(query, [props.isGoal, props.graphValueId]);

		return { status: GenEnum.SUCCESS, message: "Cíl grafu úspěšně změněn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny cíle grafu" };
	}
};

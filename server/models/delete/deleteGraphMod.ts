import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	graphId: number;

	isDefGraph: boolean;
}

export const deleteGraphMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
			DELETE FROM ${props.isDefGraph ? "default_graphs" : "user_graphs"}
			WHERE graph_id = ?
		`;

		await db.promise().query<ResultSetHeader>(query, [props.graphId]);

		return { status: GenEnum.SUCCESS, message: "Graf úspěšně odstraněn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během odstranění grafu" };
	}
};

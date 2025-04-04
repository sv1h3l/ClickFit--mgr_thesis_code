import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
}

export const createDefaultGraphMod = async (props: Props): Promise<GenRes<{ graphId: number; graphLabel: string }>> => {
	let newDefaultGraphLabel = "Nový graf";
	let createNewDefaultGraph = false;

	const checkQuery = `SELECT * FROM default_graphs WHERE sport_id = ? AND graph_label = ? LIMIT 1`;

	try {
		for (let i = 1; i < 30; ) {
			const [existingDefaultGraph] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.sportId, newDefaultGraphLabel]);

			if (existingDefaultGraph.length < 1) {
				createNewDefaultGraph = true;
				break;
			}

			i++;
			newDefaultGraphLabel = "Nový graf " + i;
		}

		if (!createNewDefaultGraph) {
			return { status: GenEnum.ALREADY_EXISTS, message: "Nelze vytvořit nový výchozí graf" };
		}

		const query = `
				INSERT INTO default_graphs (sport_id, graph_label)
				VALUES (?, ?)
			`;

		const [result] = await db.promise().query<ResultSetHeader>(query, [props.sportId, newDefaultGraphLabel]);

		return { status: GenEnum.SUCCESS, message: "Výchozí graf úspěšně vytvořen", data: { graphId: result.insertId, graphLabel: newDefaultGraphLabel } };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření výchozího grafu" };
	}
};

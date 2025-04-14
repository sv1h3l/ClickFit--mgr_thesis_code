import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	graphId: number;
	highestOrderNumber: number;
}

interface Res {
	defaultGraphOrderNumberId: number;
}

export const createDefaultGraphOrderNumberMod = async (props: Props): Promise<GenRes<Res>> => {
	try {
		const query = `
            INSERT INTO default_graphs_order_numbers (graph_id, user_id, order_number)
            VALUES (?, ?, ?)
        `;

		const [result] = await db.promise().query<ResultSetHeader>(query, [props.graphId, props.userId, props.highestOrderNumber]);

		return { status: GenEnum.SUCCESS, message: "Pořadí výchozího grafu úspěšně vytvořeno", data: { defaultGraphOrderNumberId: result.insertId } };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření pořadí výchozího grafu" };
	}
};

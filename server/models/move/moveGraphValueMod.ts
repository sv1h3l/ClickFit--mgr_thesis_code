import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	firstGraphValueId: number;
	secondGraphValueId: number;
}

export const moveGraphValueMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const firstQuery = `
				UPDATE graph_values
				SET order_number = order_number - 1
				WHERE graph_value_id = ?
			`;

		db.promise().query<ResultSetHeader>(firstQuery, [props.firstGraphValueId]);

		const secondQuery = `
				UPDATE graph_values
				SET order_number = order_number + 1
				WHERE graph_value_id = ?
			`;

		db.promise().query<ResultSetHeader>(secondQuery, [props.secondGraphValueId]);

		return { status: GenEnum.SUCCESS, message: "Pořadí záznamů grafu úspěšně změněno" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny pořadí záznamů grafu" };
	}
};

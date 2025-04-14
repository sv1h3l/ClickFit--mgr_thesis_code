import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
}

interface Res {
	graph_id: number;

	graph_label: string;
	has_date: boolean;

	y_axis_label: string;
	x_axis_label: string;

	unit: string;

	has_goals: boolean;
}

export const getDefaultGraphsMod = async (props: Props): Promise<GenRes<Res[]>> => {
	try {
		const query = `
			SELECT 
				*
			FROM default_graphs
			WHERE sport_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.sportId]);

		if (rows.length === 0) {
			return { status: GenEnum.NOT_FOUND, message: "Výchozí grafy nebyly nalezeny" };
		}

		return { status: GenEnum.SUCCESS, message: "Výchozí grafy úspěšně předány", data: rows as Res[] };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání výchozích grafů" };
	}
};

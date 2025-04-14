import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	userId: number;
}

interface Res {
	graph_id: number;

	graph_label: string;
	has_date: boolean;

	y_axis_label: string;
	x_axis_label: string;

	order_number: number;

	unit: string;

	has_goals: boolean;

}

export const getUserGraphsMod = async (props: Props): Promise<GenRes<Res[]>> => {
	try {
		const query = `
			SELECT * FROM user_graphs
			WHERE sport_id = ? AND user_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.sportId, props.userId]);

		if (rows.length === 0) {
			return { status: GenEnum.NOT_FOUND, message: "Uživatelské grafy nebyly nalezeny" };
		}

		return { status: GenEnum.SUCCESS, message: "Uživatelské grafy úspěšně předány", data: rows as Res[] };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání uživatelských grafů" };
	}
};

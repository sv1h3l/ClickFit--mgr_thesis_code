import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
}

interface Res {
	sport_detail_label_id: number;

	label: string;
	order_number: number;
}

export const getSportDetailLabsMod = async (props: Props): Promise<GenRes<Res[]>> => {
	try {
		const query = `
			SELECT 
				sport_detail_label_id,
				label,
				order_number
			FROM sport_detail_labels 
			WHERE sport_id = ?;
		`;

		const [rows] = await db.promise().query(query, [props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Štíky podrobností sportu úspěšně předány", data: rows as Res[] };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání štíků podrobností sportu" };
	}
};

import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	userId: number;
}

interface Res {
	sport_detail_value_id: number;
	sport_detail_label_id: number;

	value: string;
}

export const getSportDetailValsMod = async (props: Props): Promise<GenRes<Res[]>> => {
	try {
		const query = `
			SELECT 
				sdv.sport_detail_value_id,
				sdv.sport_detail_label_id,
				sdv.value
			FROM sport_detail_values sdv
			JOIN sport_detail_labels sdl 
				ON sdv.sport_detail_label_id = sdl.sport_detail_label_id
			WHERE sdl.sport_id = ? AND sdv.user_id = ?;
		`;

		const [rows] = await db.promise().query(query, [props.sportId, props.userId]);

		return { status: GenEnum.SUCCESS, message: "Hodnoty podrobností sportu úspěšně předány", data: rows as Res[] };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání hodnot podrobností sportu" };
	}
};

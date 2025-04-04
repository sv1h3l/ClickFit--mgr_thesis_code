import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
}

export interface Res {
	user_id: number;
	sport_id: number;

	sport_name: string;

	has_categories: boolean;
	has_difficulties: boolean;
	has_recommended_values: boolean;
	has_recommended_difficulty_values: boolean;

	unit_code: number;

	description: string;
}

export const getSportMod = async (props: Props): Promise<GenRes<Res>> => {
	try {
		const query = `
			SELECT * FROM sports
			WHERE sport_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Sport úspěšně předán", data: rows[0] as Res };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání hodnot podrobností sportu" };
	}
};

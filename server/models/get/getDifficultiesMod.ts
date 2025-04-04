import { db } from "../../server"; // Import připojení k DB
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
}

export interface Res {
	sport_difficulty_id: number;

	difficulty_name: string;
	order_number: number;
}

export const getDifficultiesMod = async (props: Props): Promise<GenRes<Res[]>> => {
	try {
		const query = `
			SELECT 
				sport_difficulty_id,
				difficulty_name,
				order_number
			FROM sport_difficulties 
			WHERE sport_id = ?;
		`;

		const [rows] = await db.promise().query(query, [props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Obtížnosti úspěšně předány", data: rows as Res[] };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání obtížností" };
	}
};

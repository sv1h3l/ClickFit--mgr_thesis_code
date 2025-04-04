import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;

	difficultyName: string;
	orderNumber: number;
}

export const createSportDifficultyMod = async (props: Props): Promise<GenRes<number>> => {
	const checkQuery = `SELECT * FROM sport_difficulties WHERE sport_id = ? AND difficulty_name = ? LIMIT 1`;

	try {
		const [existingDiffictuly] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.sportId, props.difficultyName]);

		if (existingDiffictuly.length > 0) {
			return { status: GenEnum.ALREADY_EXISTS, message: "Obtížnost s tímto názvem již existuje" };
		}

		const query = `
				INSERT INTO sport_difficulties (sport_id, order_number, difficulty_name)
				VALUES (?, ?, ?)
			`;

		const [result] = await db.promise().query<ResultSetHeader>(query, [props.sportId, props.orderNumber, props.difficultyName]);

		return { status: GenEnum.SUCCESS, message: "Obtížnost úspěšně vytvořena", data: result.insertId };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření obtížnosti" };
	}
};

import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;

	orderNumber: number;
}

export const getSportDifficultyNeighbourMod = async (props: Props): Promise<GenRes<number>> => {
	try {
		const easierDifficultyQuery = `
			SELECT sport_difficulty_id
			FROM sport_difficulties
			WHERE sport_id = ? AND order_number = ? - 1;
		`;

		const [easierRows] = await db.promise().query<RowDataPacket[]>(easierDifficultyQuery, [props.sportId, props.orderNumber]);

		if (easierRows.length === 1) {
			return { status: GenEnum.SUCCESS, data: easierRows[0].sport_difficulty_id };
		} else {
			const harderDifficultyQuery = `
				SELECT sport_difficulty_id
				FROM sport_difficulties
				WHERE sport_id = ? AND order_number = ? + 1;
			`;

			const [harderRows] = await db.promise().query<RowDataPacket[]>(harderDifficultyQuery, [props.sportId, props.orderNumber]);

			if (harderRows.length === 1) {
				return { status: GenEnum.SUCCESS, data: harderRows[0].sport_difficulty_id };
			} else {
				return { status: GenEnum.FAILURE, data: -1 };
			}
		}
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Chyba při získávání ID okolní obtížnosti" };
	}
};

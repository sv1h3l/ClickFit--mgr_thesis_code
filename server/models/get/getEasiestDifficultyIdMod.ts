import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
}

export const getEasiestDifficultyIdMod = async (props: Props): Promise<GenRes<number>> => {
	try {
		const getUnassignedDifficultyIdQuery = `
			SELECT sport_difficulty_id
			FROM sport_difficulties
			WHERE sport_id = ? AND order_number = 1;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(getUnassignedDifficultyIdQuery, [props.sportId]);

		const unassignedDifficultyId = rows[0].sport_difficulty_id || -1;

		return { status: GenEnum.SUCCESS, data: unassignedDifficultyId };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Chyba při získání ID nejlehčí obtížnosti" };
	}
};

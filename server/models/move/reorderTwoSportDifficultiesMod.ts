import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	reorderDifficulties: { difficultyId: number; orderNumber: number }[];
}

export const reorderTwoSportDifficultiesMod = async ( props: Props ): Promise<GenRes<null>> => {
	try {
		props.reorderDifficulties.map(async (difficulty) => {
			const query = `
				UPDATE sport_difficulties
				SET order_number = ?
				WHERE sport_id = ? AND sport_difficulty_id = ?
			`;

			await db.promise().query(query, [difficulty.orderNumber, props.sportId, difficulty.difficultyId]);
		});

		return { status: GenEnum.SUCCESS, message: "Obtížnosti úspěšně přeuspořádány" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během přeusporádávání obtížností" };
	}
};

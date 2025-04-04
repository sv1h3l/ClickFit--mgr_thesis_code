import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	orderNumber: number;
}

export const reorderSportDifficultiesMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
			UPDATE sport_difficulties
			SET order_number = order_number - 1
			WHERE sport_id = ? AND order_number > ?
		`;

		await db.promise().query(query, [props.sportId, props.orderNumber]);

		return { status: GenEnum.SUCCESS, message: "Obtížnosti úspěšně přeuspořádány" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během přeusporádávání obtížností" };
	}
};

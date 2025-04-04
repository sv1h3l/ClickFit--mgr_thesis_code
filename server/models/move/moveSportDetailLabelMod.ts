import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	reorderSportDetailLabels: { sportDetailLabId: number; orderNumber: number }[];
}

export const moveSportDetailLabelMod = async ( props: Props ): Promise<GenRes<null>> => {
	try {
		props.reorderSportDetailLabels.map(async (label) => {
			const query = `
				UPDATE sport_detail_labels
				SET order_number = ?
				WHERE sport_id = ? AND sport_detail_label_id = ?
			`;

			await db.promise().query(query, [label.orderNumber, props.sportId, label.sportDetailLabId]);
		});

		return { status: GenEnum.SUCCESS, message: "Podrobnosti sportu úspěšně přeuspořádány" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během přeusporádávání podrobností sportu" };
	}
};

import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	reorderExerciseInformationLabels: { exerciseInformationLabelId: number; orderNumber: number }[];
}

export const reorderExerciseInformationLabsMod = async ( props: Props ): Promise<GenRes<null>> => {
	try {
		props.reorderExerciseInformationLabels.map(async (label) => {
			const query = `
				UPDATE exercise_information_labels
				SET order_number = ?
				WHERE sport_id = ? AND exercise_information_labels_id = ?
			`;

			await db.promise().query(query, [label.orderNumber, props.sportId, label.exerciseInformationLabelId]);
		});

		return { status: GenEnum.SUCCESS, message: "Informace o cviku úspěšně přeuspořádány" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během přeusporádávání informací o cviku" };
	}
};

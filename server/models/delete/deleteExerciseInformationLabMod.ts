import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	exerciseInformationLabelId: number;
}

export const deleteExerciseInformationLabMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
            DELETE FROM exercise_information_labels WHERE sport_id = ? AND exercise_information_labels_id = ?
        `;

		await db.promise().query(query, [props.sportId, props.exerciseInformationLabelId]);

		return { status: GenEnum.SUCCESS,  message: "Informace o cviku úspěšně odstraněna"};
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během odstraňování informace o cviku" };
	}
};

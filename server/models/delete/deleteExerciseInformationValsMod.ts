import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	exerciseInformationLabelId: number;
}

export const deleteExerciseInformationValsMod = async ( props: Props ): Promise<GenRes<null>> => {
	try {
		const query = `
            DELETE FROM exercise_information_values
			WHERE exercise_information_labels_id = ?
       	`;

		await db.promise().query(query, [props.exerciseInformationLabelId]);

		return { status: GenEnum.SUCCESS, message: "Údaje informace o cviku úspěšně odstraněny" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během odstraňování hodnot informace o cviku" };
	}
};

import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	exerciseInformationValueId: number;

	exerciseInformationValue: string;
}

export const changeExerciseInformationValMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE exercise_information_values
				SET value = ?
				WHERE exercise_information_value_id = ?;
			`;

		await db.promise().query(query, [props.exerciseInformationValue, props.exerciseInformationValueId]);

		return { status: GenEnum.SUCCESS, message: "Informace o cviku úspěšně změněna" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny informace o cviku" };
	}
};

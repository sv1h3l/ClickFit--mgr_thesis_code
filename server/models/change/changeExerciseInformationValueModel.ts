import { db } from "../../server";
import { GenericModelReturn, GenericModelReturnEnum } from "../GenericModelReturn";

interface changeExerciseInformationValueModelProps {
	exerciseInformationValueId: number;

	exerciseInformationValue: string;
}

export const changeExerciseInformationValueModel = async (props: changeExerciseInformationValueModelProps): Promise<GenericModelReturn<null>> => {
	try {
		const query = `
				UPDATE exercise_information_values
				SET value = ?
				WHERE exercise_information_value_id = ?;
			`;

		await db.promise().query(query, [props.exerciseInformationValue, props.exerciseInformationValueId]);

		return { status: GenericModelReturnEnum.SUCCESS, message: "Informace o cviku úspěšně změněna" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenericModelReturnEnum.FAILURE, message: "Nastala chyba během změny informace o cviku" };
	}
};

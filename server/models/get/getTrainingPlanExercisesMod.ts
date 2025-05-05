import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";
import { TrainingPlanExercise } from "../../controllers/create/createTrainingPlanCont";

interface Props {
	trainingPlanId: number;
}

export const getTrainingPlanExercisesMod = async (props: Props): Promise<GenRes<TrainingPlanExercise[]>> => {
	try {
		const query = `
				SELECT 
					training_plan_exercise_id AS trainingPlanExerciseId,
					exercise_id AS exerciseId,
					nth_day AS nthDay,
					nth_category AS nthCategory,
					nth_exercise AS nthExercise,
					category_name AS categoryName,
					exercise_name AS exerciseName,
					repetitions,
					series,
					burden,
					unit_code AS unitCode
				FROM training_plans_exercises
				WHERE training_plan_id = ?
			`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.trainingPlanId]);

		return { status: GenEnum.SUCCESS, message: "Cviky tréninkového plánu úspěšně předány", data: rows as TrainingPlanExercise[] };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání cviků tréninkového plánu" };
	}
};

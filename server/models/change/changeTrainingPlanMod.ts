import { ResultSetHeader } from "mysql2";
import { TrainingPlanExercise } from "../../controllers/create/createTrainingPlanCont";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	trainingPlanId: number;

	trainingPlanName: string;

	hasBurdenAndUnit: boolean;
	unitCode: number;

	trainingPlanExercises: TrainingPlanExercise[];
}

export const changeTrainingPlanMod = async (props: Props): Promise<GenRes<null>> => {
	const connection = await db.promise().getConnection();

	try {
		await connection.beginTransaction();

		const updateTrainingPlanQuery = `
			UPDATE training_plans
			SET name = ?, has_burden_and_unit = ?, unit_code = ?
			WHERE training_plan_id = ?
		`;

		await connection.query<ResultSetHeader>(updateTrainingPlanQuery, [props.trainingPlanName, props.hasBurdenAndUnit, props.unitCode, props.trainingPlanId]);

		const deleteExercisesQuery = `
			DELETE FROM training_plans_exercises
			WHERE training_plan_id = ?
		`;

		await connection.execute(deleteExercisesQuery, [props.trainingPlanId]);

		for (const exercise of props.trainingPlanExercises) {
			const exerciseId = exercise.exerciseId || null;

			const createTrainingPlanExerciseQuery = `
				INSERT INTO training_plans_exercises (training_plan_id, exercise_id, nth_day, nth_category, nth_exercise, category_name, exercise_name, repetitions, series, burden, unit_code)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`;

			await connection.query<ResultSetHeader>(createTrainingPlanExerciseQuery, [
				props.trainingPlanId,
				exerciseId,
				exercise.nthDay,
				exercise.nthCategory,
				exercise.nthExercise,
				exercise.categoryName,
				exercise.exerciseName,
				exercise.repetitions,
				exercise.series,
				exercise.burden,
				exercise.unitCode,
			]);
		}

		await connection.commit();
		connection.release();

		return { status: GenEnum.SUCCESS, message: "Tréninkový plán úspěšně upraven"};
	} catch (error) {
		await connection.rollback();
		connection.release();
		console.error("Database transaction error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během úpravy tréninkového plánu" };
	}
};

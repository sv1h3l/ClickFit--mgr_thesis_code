import { ResultSetHeader } from "mysql2";
import { TrainingPlanExercise } from "../../controllers/create/createTrainingPlanCont";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	authorId: number;
	ownerId: number;
	sportId: number;

	trainingPlanName: string;
	canOwnerEdit: boolean;
	dateOfCreation: string;

	hasBurdenAndUnit: boolean;
	unitCode: number;

	trainingPlanExercises: TrainingPlanExercise[];
}

interface Res {
	trainingPlanId: number;
}

export const createTrainingPlanMod = async (props: Props): Promise<GenRes<Res>> => {
	const connection = await db.promise().getConnection();

	const ownerId = props.ownerId || null;

	try {
		await connection.beginTransaction();

		const reorderTrainingPlansQuery = `
			UPDATE training_plans
			SET order_number = order_number + 1
			WHERE (author_id = ? AND owner_id IS NULL)
			OR owner_id = ?;
		`;
		await connection.query<ResultSetHeader>(reorderTrainingPlansQuery, [ownerId ? ownerId : props.authorId, ownerId ? ownerId : props.authorId]);

		const createTrainingPlanQuery = `
			INSERT INTO training_plans (sport_id, author_id, owner_id, name, can_owner_edit, date_of_creation, unit_code, has_burden_and_unit)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`;
		const [insertResult] = await connection.query<ResultSetHeader>(createTrainingPlanQuery, [props.sportId, props.authorId, ownerId, props.trainingPlanName, props.canOwnerEdit, props.dateOfCreation, props.unitCode, props.hasBurdenAndUnit]);
		const trainingPlanId = insertResult.insertId;

		for (const exercise of props.trainingPlanExercises) {
			const exerciseId = exercise.exerciseId || null;

			const createTrainingPlanExerciseQuery = `
				INSERT INTO training_plans_exercises (training_plan_id, exercise_id, nth_day, nth_category, nth_exercise, category_name, exercise_name, repetitions, series, burden, unit_code)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`;

			await connection.query<ResultSetHeader>(createTrainingPlanExerciseQuery, [
				trainingPlanId,
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

		return { status: GenEnum.SUCCESS, message: "Tréninkový plán úspěšně vytvořen", data: { trainingPlanId } };
	} catch (error) {
		await connection.rollback();
		connection.release();
		console.error("Database transaction error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření tréninkového plánu" };
	}
};

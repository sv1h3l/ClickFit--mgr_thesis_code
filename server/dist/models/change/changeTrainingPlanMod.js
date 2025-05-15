"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeTrainingPlanMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeTrainingPlanMod = async (props) => {
    const connection = await server_1.db.promise().getConnection();
    try {
        await connection.beginTransaction();
        const updateTrainingPlanQuery = `
			UPDATE training_plans
			SET name = ?, has_burden_and_unit = ?, unit_code = ?
			WHERE training_plan_id = ?
		`;
        await connection.query(updateTrainingPlanQuery, [props.trainingPlanName, props.hasBurdenAndUnit, props.unitCode, props.trainingPlanId]);
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
            await connection.query(createTrainingPlanExerciseQuery, [
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
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Tréninkový plán úspěšně upraven" };
    }
    catch (error) {
        await connection.rollback();
        connection.release();
        console.error("Database transaction error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během úpravy tréninkového plánu" };
    }
};
exports.changeTrainingPlanMod = changeTrainingPlanMod;
//# sourceMappingURL=changeTrainingPlanMod.js.map
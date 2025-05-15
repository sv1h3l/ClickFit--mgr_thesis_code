"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrainingPlanMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createTrainingPlanMod = async (props) => {
    const connection = await server_1.db.promise().getConnection();
    try {
        await connection.beginTransaction();
        const reorderTrainingPlansQuery = `
			UPDATE training_plans
			SET order_number = order_number + 1
			WHERE owner_id = ?;
		`;
        await connection.query(reorderTrainingPlansQuery, [props.ownerId]);
        const createTrainingPlanQuery = `
			INSERT INTO training_plans (sport_id, author_id, owner_id, name, can_owner_edit, date_of_creation, unit_code, has_burden_and_unit)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`;
        const [insertResult] = await connection.query(createTrainingPlanQuery, [props.sportId, props.authorId, props.ownerId, props.trainingPlanName, props.canOwnerEdit, props.dateOfCreation, props.unitCode, props.hasBurdenAndUnit]);
        const trainingPlanId = insertResult.insertId;
        for (const exercise of props.trainingPlanExercises) {
            const exerciseId = exercise.exerciseId || null;
            const createTrainingPlanExerciseQuery = `
				INSERT INTO training_plans_exercises (training_plan_id, exercise_id, nth_day, nth_category, nth_exercise, category_name, exercise_name, repetitions, series, burden, unit_code)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`;
            await connection.query(createTrainingPlanExerciseQuery, [
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
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Tréninkový plán úspěšně vytvořen", data: { trainingPlanId } };
    }
    catch (error) {
        await connection.rollback();
        connection.release();
        console.error("Database transaction error: " + error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během vytváření tréninkového plánu" };
    }
};
exports.createTrainingPlanMod = createTrainingPlanMod;
//# sourceMappingURL=createTrainingPlanMod.js.map
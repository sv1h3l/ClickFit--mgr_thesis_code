"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingPlanExercisesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getTrainingPlanExercisesMod = async (props) => {
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
        const [rows] = await server_1.db.promise().query(query, [props.trainingPlanId]);
        return { status: GenResEnum_1.GenEnum.SUCCESS, message: "Cviky tréninkového plánu úspěšně předány", data: rows };
    }
    catch (error) {
        console.error("Database error: ", error);
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během získávání cviků tréninkového plánu" };
    }
};
exports.getTrainingPlanExercisesMod = getTrainingPlanExercisesMod;
//# sourceMappingURL=getTrainingPlanExercisesMod.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferExercisesMod = void 0;
const server_1 = require("../../server");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const transferExercisesMod = async ({ props }) => {
    try {
        let highestOrderNumber = props.highestOrderNumber;
        for (const exercise of props.exercisesOfCategory) {
            const query = `
				UPDATE exercises
				SET category_id = ?, order_number = ?
				WHERE sport_id = ? AND exercise_id = ?
			`;
            await server_1.db.promise().query(query, [props.categoryId, highestOrderNumber, props.sportId, exercise.exerciseId]);
            highestOrderNumber = highestOrderNumber + 1;
        }
        return { status: GenResEnum_1.GenEnum.SUCCESS };
    }
    catch (error) {
        console.error("Database error: ", error); // FIXME udělat logování u ostatních modelů, aby nebyly předávány error skrze message ale vypsala se do console.error
        return { status: GenResEnum_1.GenEnum.FAILURE, message: "Nastala chyba během přesouvání cviků z odstraňované kategorie" };
    }
};
exports.transferExercisesMod = transferExercisesMod;
//# sourceMappingURL=transferExercisesMod.js.map
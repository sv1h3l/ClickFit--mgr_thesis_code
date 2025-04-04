import { RowDataPacket } from "mysql2";
import { db } from "../../server";

export enum ExerciseCreationStatus {
	SUCCESS = 0,
	ALREADY_EXISTS = 1,
	FAILURE = 2,
}

interface Props {
	sportId: number;
	categoryId: number;
	sportDifficultyId: number;

	exerciseName: string;
	orderNumber: number;
	orderNumberWithoutCategories: number;
	unitCode: number;
}

export const createExerciseMod = async ({ props }: { props: Props }): Promise<{ status: ExerciseCreationStatus; exerciseId?: number }> => {
	const checkQuery = `SELECT * FROM exercises WHERE sport_id = ? AND name = ? LIMIT 1`;

	try {
		const [existingCategory] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.sportId, props.exerciseName]);

		if (existingCategory.length > 0) {
			return { status: ExerciseCreationStatus.ALREADY_EXISTS };
		}

		const insertQuery = `
            INSERT INTO exercises (sport_id, name, order_number, order_number_without_categories, category_id, sport_difficulty_id, unit_code)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

		// Perform the insert
		const [result] = await db.promise().query(insertQuery, [props.sportId, props.exerciseName, props.orderNumber, props.orderNumberWithoutCategories, props.categoryId, props.sportDifficultyId, props.unitCode]);

		const exerciseId = (result as { insertId: number }).insertId;

		return { status: ExerciseCreationStatus.SUCCESS, exerciseId: exerciseId };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: ExerciseCreationStatus.FAILURE };
	}
};

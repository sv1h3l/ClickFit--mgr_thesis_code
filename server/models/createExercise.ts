import { RowDataPacket } from "mysql2";
import { db } from "../server";

export enum ExerciseCreationStatus {
	SUCCESS = 0,
	ALREADY_EXISTS = 1,
	FAILURE = 2,
}

interface CreateExerciseProps {
	sportId: number;
	categoryId: number;

	exerciseName: string;
	orderNumber: number;
}

export const createExercise = async ({ props }: { props: CreateExerciseProps }): Promise<{ status: ExerciseCreationStatus; exerciseId?: number }> => {
	const checkQuery = `SELECT * FROM exercises WHERE sport_id = ? AND name = ? LIMIT 1`;

	try {
		const [existingCategory] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.sportId, props.exerciseName]);

		if (existingCategory.length > 0) {
			return { status: ExerciseCreationStatus.ALREADY_EXISTS };
		}

		const insertQuery = `
            INSERT INTO exercises (sport_id, name, order_number, category_id)
            VALUES (?, ?, ?, ?)
        `;

		// Perform the insert
		const [result] = await db.promise().query(insertQuery, [props.sportId, props.exerciseName, props.orderNumber, props.categoryId === -1 ? null : props.categoryId]);

		const exerciseId = (result as { insertId: number }).insertId; // FIXME je insertId správné ?

		return { status: ExerciseCreationStatus.SUCCESS, exerciseId: exerciseId };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: ExerciseCreationStatus.FAILURE };
	}
};

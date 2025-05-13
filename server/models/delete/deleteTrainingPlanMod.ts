import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	trainingPlanId: number;
	orderNumber: number;
}

export const deleteTrainingPlanMod = async (props: Props): Promise<GenRes<null>> => {
	const connection = await db.promise().getConnection();

	const deleteQuery = `
		DELETE FROM training_plans
		WHERE training_plan_id = ?
	`;

	const ownerQuery = `
		SELECT owner_id FROM training_plans
		WHERE training_plan_id = ? LIMIT 1
	`;

	
	const reorderQuery = `
		UPDATE training_plans
		SET order_number = order_number - 1
		WHERE order_number > ? AND owner_id = ?
	`;

	try {
		await connection.beginTransaction();

		const [rows] = await connection.query<RowDataPacket[]>(ownerQuery, [props.trainingPlanId]);

		if (rows.length === 0) {
			throw new Error("Training plan not found");
		}

		const ownerId = (rows[0] as { owner_id: number }).owner_id;

		await connection.query(deleteQuery, [props.trainingPlanId]);

		await connection.query(reorderQuery, [props.orderNumber, ownerId]);

		await connection.commit();
		connection.release();

		return { status: GenEnum.SUCCESS, message: "Tréninkový plán úspěšně smazán" };
	} catch (error) {
		await connection.rollback();
		connection.release();
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během mazání tréninkového plánu" };
	}
};

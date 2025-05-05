import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	trainingPlanId: number;
}

export const checkTrainingPlanViewMod = async (props: Props): Promise<GenRes<null>> => {
	const checkQuery = `
		SELECT training_plan_id FROM training_plans
		WHERE training_plan_id = ? AND (owner_id = ? OR author_id = ?)
		LIMIT 1
	`;

	try {
		const [rows] = await db
			.promise()
			.query<RowDataPacket[]>(checkQuery, [
				props.trainingPlanId,
				props.userId,
				props.userId,
			]);

		if (rows.length > 0) {
			return { status: GenEnum.SUCCESS };
		}

		return { status: GenEnum.FAILURE };
	} catch (error) {
		console.error("Database error:", error);
		return { status: GenEnum.FAILURE };
	}
};

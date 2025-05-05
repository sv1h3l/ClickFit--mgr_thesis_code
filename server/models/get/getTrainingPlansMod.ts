import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
}

export interface Res {
	trainingPlanId: number;
	sportId: number;
	authorId: number;
	ownerId: number;

	name: string;
	sportName: string;
	authorName: string;
	orderNumber: number;
	dateOfCreation: string;

	hasBurdenAndUnit: boolean;
	unitCode: number;

	canOwnerEdt?: boolean;
}

export const getTrainingPlansMod = async (props: Props): Promise<GenRes<Res[]>> => {
	try {
		const query = `
				SELECT 
					tp.training_plan_id AS trainingPlanId,
					tp.sport_id AS sportId,
					tp.author_id AS authorId,
					tp.owner_id AS ownerId,
					tp.name,
					s.sport_name AS sportName,
					CONCAT(u.first_name, ' ', u.last_name) AS authorName,
					tp.order_number AS orderNumber,
					tp.date_of_creation AS dateOfCreation,
					tp.can_owner_edit AS canOwnerEdt,
					tp.has_burden_and_unit AS hasBurdenAndUnit,
					tp.unit_code AS unitCode
				FROM training_plans tp
				JOIN sports s ON tp.sport_id = s.sport_id
				JOIN users u ON tp.author_id = u.user_id
				WHERE tp.owner_id = ? OR tp.author_id = ?
				ORDER BY tp.order_number ASC;
			`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.userId, props.userId]);

		return { status: GenEnum.SUCCESS, message: "Tréninkové plány úspěšně předány", data: rows as Res[] };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání tréninkových plánů" };
	}
};

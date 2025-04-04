import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;

	exerciseInformationLabel: string;
	orderNumber: number;
}

export const createExerciseInformationLabMod = async ({ sportId, exerciseInformationLabel, orderNumber }: Props): Promise<GenRes<number>> => {
	const checkQuery = `SELECT * FROM exercise_information_labels WHERE sport_id = ? AND label = ? LIMIT 1`;

	try {
		const [existingLabel] = await db.promise().query<RowDataPacket[]>(checkQuery, [sportId, exerciseInformationLabel]);

		if (existingLabel.length > 0) {
			return { status: GenEnum.ALREADY_EXISTS, message: "Informace o cviku stímto názvem již existuje" };
		}

		const query = `
				INSERT INTO exercise_information_labels (sport_id, label, order_number) 
				VALUES (?, ?, ?);
			`;

		const [result] = await db.promise().query(query, [sportId, exerciseInformationLabel, orderNumber]);

		const exerciseInformationLabelId = (result as { insertId: number }).insertId; // FIXME je insertId správné ?

		return { status: GenEnum.SUCCESS, message: "Informace o cviku úspěšně vytvořena", data: exerciseInformationLabelId };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření informace o cviku" };
	}
};

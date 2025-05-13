import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	exerciseName: string;
}

export const checkExerciseNameExistenceMod = async (props : Props): Promise<GenRes<null>> => {
	const checkQuery = `SELECT * FROM exercises WHERE sport_id = ? AND name = ? LIMIT 1`;

	try {
		const [authorizedPerson] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.sportId, props.exerciseName]);

		if (authorizedPerson.length > 0) {
			return { status: GenEnum.ALREADY_EXISTS, message: "Cvik s tímto názvem již existuje" };
		}

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE };
	}
};

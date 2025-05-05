import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	entityId: number;

	changeExerciseDesc: boolean;

	description: string;
}

export const changeDescMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE ${props.changeExerciseDesc ? "exercises" : "categories"}
				SET description = ?
				WHERE sport_id = ? AND ${props.changeExerciseDesc ? "exercise_id" : "category_id"} = ?
			`;

		await db.promise().query(query, [props.description, props.sportId, props.entityId]);

		return { status: GenEnum.SUCCESS, message: `Popis ${props.changeExerciseDesc ? "cviku" : "kategorie"} úspěšně změněn` };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: `Nastala chyba během změny popisu ${props.changeExerciseDesc ? "cviku" : "kategorie"}` };
	}
};

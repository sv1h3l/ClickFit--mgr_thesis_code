import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	entityId: number;

	entityIsExercise: boolean;
	tightConnectionEntityId: number | undefined;
}

export const changeTightEntityMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE ${props.entityIsExercise ? "exercises" : "categories"}
				SET tight_connection = ?
				WHERE ${props.entityIsExercise ? "exercise_id" : "category_id"} = ?
			`;

		await db.promise().query(query, [JSON.stringify(props.tightConnectionEntityId), props.entityId]);

		return { status: GenEnum.SUCCESS, message: `Pevná návaznost ${props.entityIsExercise ? "cviku" : "kategorie"} úspěšně změněny` };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: `Nastala chyba během změny pevné návaznosti ${props.entityIsExercise ? "cviku" : "kategorie"}` };
	}
};

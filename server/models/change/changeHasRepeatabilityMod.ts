import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	entityId: number;

	entityIsExercise: boolean;
	hasRepeatability: boolean;
}

export const changeHasRepeatabilityMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE ${props.entityIsExercise ? "exercises" : "categories"}
				SET has_repeatability = ?
				WHERE ${props.entityIsExercise ? "exercise_id" : "category_id"} = ?
			`;

		await db.promise().query(query, [props.hasRepeatability, props.entityId]);

		return { status: GenEnum.SUCCESS, message: `Opakovatelnost ${props.entityIsExercise ? "cviku" : "kategorie"} úspěšně změněna` };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: `Nastala chyba během změny opakovatelnosti ${props.entityIsExercise ? "cviku" : "kategorie"}` };
	}
};

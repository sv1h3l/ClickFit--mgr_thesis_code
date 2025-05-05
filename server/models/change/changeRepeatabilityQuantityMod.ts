import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	entityId: number;

	entityIsExercise: boolean;
	repeatabilityQuantity: number;
}

export const changeRepeatabilityQuantityMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE ${props.entityIsExercise ? "exercises" : "categories"}
				SET repeatability_quantity = ?
				WHERE ${props.entityIsExercise ? "exercise_id" : "category_id"} = ?
			`;

		await db.promise().query(query, [props.repeatabilityQuantity, props.entityId]);

		return { status: GenEnum.SUCCESS, message: `Maximální počet opakování ${props.entityIsExercise ? "cviku" : "kategorie"} úspěšně změněn` };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: `Nastala chyba během změny maximálního početu opakování ${props.entityIsExercise ? "cviku" : "kategorie"}` };
	}
};

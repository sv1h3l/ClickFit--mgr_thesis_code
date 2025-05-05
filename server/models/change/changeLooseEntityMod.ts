import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	entityId: number;

	entityIsExercise: boolean;
	looseEntitiesIds: number[];
}

export const changeLooseEntityMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE ${props.entityIsExercise ? "exercises" : "categories"}
				SET loose_connection = ?
				WHERE ${props.entityIsExercise ? "exercise_id" : "category_id"} = ?
			`;

		await db.promise().query(query, [JSON.stringify(props.looseEntitiesIds), props.entityId]);

		return { status: GenEnum.SUCCESS, message: `Volné návaznosti ${props.entityIsExercise ? "cviku" : "kategorie"} úspěšně změněny` };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: `Nastala chyba během změny volných návazností ${props.entityIsExercise ? "cviku" : "kategorie"}` };
	}
};

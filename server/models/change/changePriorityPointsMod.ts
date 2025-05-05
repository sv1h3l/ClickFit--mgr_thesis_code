import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	entityId: number;

	entityIsExercise: boolean;
	priorityPoints: number | undefined;
}

export const changePriorityPointsMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE ${props.entityIsExercise ? "exercises" : "categories"}
				SET priority_points = ?
				WHERE ${props.entityIsExercise ? "exercise_id" : "category_id"} = ?
			`;

		await db.promise().query(query, [JSON.stringify(props.priorityPoints), props.entityId]);

		return { status: GenEnum.SUCCESS, message: `Prioritní body ${props.entityIsExercise ? "cviku" : "kategorie"} úspěšně změněny` };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: `Nastala chyba během změny prioritních bodů ${props.entityIsExercise ? "cviku" : "kategorie"}` };
	}
};

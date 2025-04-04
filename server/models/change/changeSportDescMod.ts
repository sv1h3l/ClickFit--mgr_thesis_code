import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	description: string;
}

export const changeSportDescMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE sports
				SET description = ?
				WHERE sport_id = ?
			`;

		await db.promise().query(query, [props.description, props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Popis sportu úspěšně změněn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny popisu sportu" };
	}
};

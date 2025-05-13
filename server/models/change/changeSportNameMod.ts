import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	sportName: string;
}

export const changeSportNameMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE sports
				SET sport_name = ?
				WHERE sport_id = ?
			`;

		await db.promise().query(query, [props.sportName, props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Název sportu úspěšně změněn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny názvu sportu" };
	}
};

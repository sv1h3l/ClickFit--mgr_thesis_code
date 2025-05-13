import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
}

export const deleteSportMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
			DELETE FROM sports
			WHERE sport_id = ?
		`;

		await db.promise().query(query, [props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Sport úspěšně smazán" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během mazání sportu" };
	}
};

import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	sportId: number;
}

export const createSharedSportMod = async (props: Props): Promise<GenRes<null>> => {
	const insertQuery = `
			INSERT INTO shared_sports (user_id, sport_id)
			VALUES (?, ?)
		`;
	try {
		await db.promise().query(insertQuery, [props.userId, props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Sport úspěšně sdílen" };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během sdílení sportu" };
	}
};

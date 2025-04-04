import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	sportDifficultyId: number;
}

export const deleteSportDifficultyMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
            DELETE FROM sport_difficulties
			WHERE sport_id = ? AND sport_difficulty_id = ?
       	`;

		await db.promise().query(query, [props.sportId, props.sportDifficultyId]);

		return { status: GenEnum.SUCCESS, message: "Obtížnost úspěšně odstraněna" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během odstraňování obtížnosti" };
	}
};

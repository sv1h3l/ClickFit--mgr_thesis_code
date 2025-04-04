import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	exerciseId: number;

	youtubeLink: string;
}

export const changeYoutubeLinkMod = async ({ sportId, exerciseId, youtubeLink }: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE exercises
				SET youtube_link = ?
				WHERE sport_id = ? AND exercise_id = ?
			`;

		await db.promise().query(query, [youtubeLink, sportId, exerciseId]);

		return { status: GenEnum.SUCCESS, message: "Odkaz na video úspěšně změněn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny odkazu na video" };
	}
};

import { db } from "../../server";
import { GenericModelReturn, GenericModelReturnEnum } from "../GenericModelReturn";

interface ChangeExerciseDescriptionModelProps {
	sportId: number;
	exerciseId: number;

	youtubeLink: string;
}

export const changeYoutubeLinkModel = async ({ sportId, exerciseId, youtubeLink }: ChangeExerciseDescriptionModelProps): Promise<GenericModelReturn<null>> => {
	try {
		const query = `
				UPDATE exercises
				SET youtube_link = ?
				WHERE sport_id = ? AND exercise_id = ?
			`;

		await db.promise().query(query, [youtubeLink, sportId, exerciseId]);

		return { status: GenericModelReturnEnum.SUCCESS, message: "Odkaz na video úspěšně změněn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenericModelReturnEnum.FAILURE, message: "Nastala chyba během změny odkazu na video" };
	}
};

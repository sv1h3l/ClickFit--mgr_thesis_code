import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	diaryId: number;
	content: number;
}

export const changeDiaryContentMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE diaries
				SET content = ?
				WHERE diary_id = ?
			`;

		await db.promise().query(query, [props.content, props.diaryId]);

		return { status: GenEnum.SUCCESS, message: "Obsah deníku úspěšně změněn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny obsahu deníku" };
	}
};

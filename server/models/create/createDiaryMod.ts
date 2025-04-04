import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	userId: number;
}

interface Res {
	diary_id: number;
	sport_id: number;
}

export const createDiaryMod = async (props: Props): Promise<GenRes<Res>> => {
	try {
		const emptyContent = "";

		const query = `
            INSERT INTO diaries (sport_id, user_id, content)
            VALUES (?, ?, ?)
        `;

		// Perform the insert
		const [result] = await db.promise().query(query, [props.sportId, props.userId, emptyContent]);

		const diary_id = (result as { insertId: number }).insertId;

		return { status: GenEnum.SUCCESS, message: "Deník úspěšně vytvořen", data: { sport_id: props.sportId, diary_id: diary_id } };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření deníku" };
	}
};

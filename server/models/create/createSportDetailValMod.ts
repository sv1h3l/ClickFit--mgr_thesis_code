import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	sport_detail_label_id: number;
}

export const createSportDetailValMod = async (props: Props): Promise<GenRes<number>> => {
	try {
		const query = `
				INSERT INTO sport_detail_values (sport_detail_label_id, user_id)
				VALUES (?, ?)
			`;

		const [result] = await db.promise().query(query, [props.sport_detail_label_id, props.userId]);

		const sportDetailValId = (result as { insertId: number }).insertId;

		return { status: GenEnum.SUCCESS, message: "Hodnota údaje sportu úspěšně vytvořena", data: sportDetailValId };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření hodnoty údaje sportu" };
	}
};

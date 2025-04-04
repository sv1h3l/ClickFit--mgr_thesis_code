import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	sportDetailValId: number;

	sportDetailVal: string;
}

export const changeSportDetailValMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE sport_detail_values
				SET value = ?
				WHERE user_id = ? AND sport_detail_value_id = ?
			`;

		await db.promise().query(query, [props.sportDetailVal, props.userId, props.sportDetailValId]);

		return { status: GenEnum.SUCCESS, message: "Hodnota údaje sportu úspěšně změněna" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny hodnoty údaje sportu" };
	}
};

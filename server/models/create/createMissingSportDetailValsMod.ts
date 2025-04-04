import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	missingSportDetailIds: number[];
}

export const createMissingSportDetailValsMod = async (props: Props): Promise<GenRes<number>> => {
	try {
		props.missingSportDetailIds.map((detailId) => {
			const query = `
			INSERT INTO sport_detail_values (sport_detail_label_id, user_id)
			VALUES (?, ?)
		`;

			db.promise().query<ResultSetHeader>(query, [detailId, props.userId]);
		});

		return { status: GenEnum.SUCCESS, message: "Prázdné hodnoty sportu úspěšně vytvořeny" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření prázdných hodnot sportu" };
	}
};

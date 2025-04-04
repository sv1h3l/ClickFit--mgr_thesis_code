import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	unitCode: number;
}

export const changeUnitCodeMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE sports
				SET unit_code = ?
				WHERE sport_id = ?
			`;

		await db.promise().query(query, [props.unitCode, props.sportId]);

		return { status: GenEnum.SUCCESS, message: "Jednotka sportu úspěšně změněna" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny jednotky sportu" };
	}
};

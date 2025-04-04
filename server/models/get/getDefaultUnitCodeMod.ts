import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
}

export const getDefaultUnitCodeMod = async (props: Props): Promise<GenRes<number>> => {
	try {
		const query = `
			SELECT unit_code
			FROM sports
			WHERE sport_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.sportId]);

		const unitCode = rows[0].unit_code || 0;

		return { status: GenEnum.SUCCESS, data: unitCode };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Chyba při získání kódu jednotky" };
	}
};

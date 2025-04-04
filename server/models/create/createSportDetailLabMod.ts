import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;

	sportDetailLab: string;
	orderNumber: number;
}

export const createSportDetailLabMod = async (props: Props): Promise<GenRes<number>> => {
	const checkQuery = `SELECT * FROM sport_detail_labels WHERE sport_id = ? AND label = ? LIMIT 1`;

	try {
		const [existingLabel] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.sportId, props.sportDetailLab]);

		if (existingLabel.length > 0) {
			return { status: GenEnum.ALREADY_EXISTS, message: "Štítek údaje sportu s tímto názvem již existuje" };
		}

		const query = `
				INSERT INTO sport_detail_labels (sport_id, label, order_number) 
				VALUES (?, ?, ?);
			`;

		const [result] = await db.promise().query(query, [props.sportId, props.sportDetailLab, props.orderNumber]);

		const sportDetailLabId = (result as { insertId: number }).insertId;

		return { status: GenEnum.SUCCESS, message: "Štítek údaje sportu úspěšně vytvořen", data: sportDetailLabId };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během vytváření štítku údaje sportu" };
	}
};

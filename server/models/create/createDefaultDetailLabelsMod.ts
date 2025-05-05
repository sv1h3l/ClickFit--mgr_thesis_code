import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

export const createDefaultDetailLabelsMod = async (sportId: number): Promise<GenRes<null>> => {
	try {
		const insertQuery = `
            INSERT INTO sport_detail_labels (sport_id, label, order_number)
            VALUES
				(?, "Minimální počet tréninkových dní", 1),
				(?, "Maximální počet tréninkových dní", 2),
				(?, "Minimální počet kategorií pro jednotlivé dny", 3),
				(?, "Maximální počet kategorií pro jednotlivé dny", 4),
				(?, "Minimální počet cviků pro jednotlivé kategorie", 5),
				(?, "Maximální počet cviků pro jednotlivé kategorie", 6),
				(?, "Obtížnost cviků", 7);
        `;

		await db.promise().query(insertQuery, [sportId, sportId, sportId, sportId, sportId, sportId, sportId]);

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE };
	}
};

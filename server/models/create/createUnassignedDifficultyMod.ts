import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

export const createDefaultDifficultiesMod = async (sportId: number): Promise<GenRes<null>> => {
	try {
		const insertQuery = `
            INSERT INTO sport_difficulties (sport_id, difficulty_name, order_number)
            VALUES
				(?, "Lehká", 1),
				(?, "Střední", 2),
				(?, "Těžká", 3);
        `;

		await db.promise().query(insertQuery, [sportId]);

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE };
	}
};

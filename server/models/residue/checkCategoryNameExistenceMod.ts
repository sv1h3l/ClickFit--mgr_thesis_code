import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	sportId: number;
	categoryName: string;
}

export const checkCategoryNameExistenceMod = async (props : Props): Promise<GenRes<null>> => {
	const checkQuery = `SELECT * FROM categories WHERE sport_id = ? AND category_name = ? LIMIT 1`;

	try {
		const [authorizedPerson] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.sportId, props.categoryName]);

		if (authorizedPerson.length > 0) {
			return { status: GenEnum.ALREADY_EXISTS, message: "Kategorie s tímto názvem již existuje" };
		}

		return { status: GenEnum.SUCCESS };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE };
	}
};

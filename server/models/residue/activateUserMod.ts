import { ResultSetHeader } from "mysql2";
import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

export const activateUserMod = async (token: string): Promise<GenRes<null>> => {
	// HACK complete
	
	const query = `
		UPDATE users
		SET is_active = 1
		WHERE token = ?`;

	try {
		const [result] = await db.promise().query<ResultSetHeader>(query, [token]);

		if (result.affectedRows === 0) {
			return { status: GenEnum.FAILURE, message: "Neplatný nebo již použitý ověřovací token." };
		}

		return { status: GenEnum.SUCCESS, message: "Registrace úspěšně ověřena." };
	} catch (error) {
		console.error("Error:", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během ověřování." };
	}
};

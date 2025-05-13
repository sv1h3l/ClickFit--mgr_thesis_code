import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

export interface Res {
	colorSchemeCode: number;
	textSizeCode: number;
}

interface Props {
	userId: number;
}

export const getUserSettingsMod = async (props: Props): Promise<GenRes<Res>> => {
	try {
		const query = `
			SELECT 
				color_scheme_code AS colorSchemeCode,
				text_size_code AS textSizeCode
			FROM users
			WHERE user_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.userId]);

		if (rows.length === 0) {
			return { status: GenEnum.FAILURE, message: "Uživatel nebyl nalezen" };
		}

		const user = rows[0] as Res;

		return { status: GenEnum.SUCCESS, message: "Nastavení uživatele úspěšně předáno", data: user };
	} catch (error) {
		console.error("Chyba databáze: ", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během předávání nastavení uživatele" };
	}
};

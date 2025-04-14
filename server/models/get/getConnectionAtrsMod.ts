import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
}

interface Res {
	connectionCode: string;
}

export const getConnectionAtrsMod = async (props: Props): Promise<GenRes<Res>> => {
	try {
		const getCCquery = `
			SELECT connection_code FROM users
			WHERE user_id = ? LIMIT 1;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(getCCquery, [props.userId]);

		if (rows.length > 0) {
			return { status: GenEnum.SUCCESS, message: "Kód spojení úspěšně nalezen", data: { connectionCode: rows[0].connection_code } };
		} else {
			return { status: GenEnum.NOT_FOUND, message: "Kód spojení nebyl nalezen" };
		}
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během získávání kódu spojení" };
	}
};

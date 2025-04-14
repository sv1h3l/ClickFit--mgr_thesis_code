import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	connectionCode: number;
}

interface Res {
	user_id: number;

	first_name: string;
	last_name: string;
}

export const checkConnectionCodeMod = async (props: Props): Promise<GenRes<Res>> => {
	const checkQuery = `
					SELECT user_id, first_name, last_name FROM users
					WHERE connection_code = ? LIMIT 1
				`;

	try {
		const [user] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.connectionCode]);

		if (user.length === 0) {
			return { status: GenEnum.NOT_FOUND, message: "Uživatel s patřičným kódem spojení nebyl nalezen" };
		}

		return { status: GenEnum.SUCCESS, message: "Uživatel s patřičným kódem spojení úspěšně předán", data: user[0] as Res };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během hledání uživatele s patřičným kódem spojení" };
	}
};

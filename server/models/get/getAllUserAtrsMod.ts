import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

export interface Res {
	user_id: number;
	subscription_id: number;

	email: string;
	first_name: string;
	last_name: string;

	age: number;
	sex: "muž" | "žena" | "neuvedeno";
	height: number;
	weight: number;
	health: string;
}

interface Props {
	userId: number;
	email: string;
}

export const getAllUserAtrsMod = async (props: Props): Promise<GenRes<Res>> => {
	try {
		const query = `
			SELECT 
				user_id,
				subscription_id,
				email,
				first_name,
				last_name,
				age,
				sex,
				height,
				weight,
				health
			FROM users
			WHERE user_id = ? AND email = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(query, [props.userId, props.email]);

		if (rows.length === 0) {
			return { status: GenEnum.FAILURE, message: "Uživatel nebyl nalezen" };
		}

		const user = rows[0] as Res;

		return { status: GenEnum.SUCCESS, message: "Veškeré informace o uživateli úspěšně předány", data: user };
	} catch (error) {
		console.error("Chyba databáze: ", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během předávání veskerých informací o uživateli" };
	}
};

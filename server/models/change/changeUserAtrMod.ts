import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	userEmail: string;
	column: string;
	value: string;
}

export const changeUserAtrMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE users
				SET ${props.column} = ?
				WHERE user_id = ? AND email = ?
			`;

		await db.promise().query(query, [props.value, props.userId, props.userEmail]);

		return { status: GenEnum.SUCCESS, message: "Údaj uživatele úspěšně změněn" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny údaje uživatele" };
	}
};

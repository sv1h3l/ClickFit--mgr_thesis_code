import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	userEmail: string;
	hashedPassword: string;
}

export const changeUserPswMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE users
				SET hashed_password = ?
				WHERE user_id = ? AND email = ?
			`;

		await db.promise().query(query, [props.hashedPassword, props.userId, props.userEmail]);

		return { status: GenEnum.SUCCESS, message: "Heslo uživatele úspěšně změněno" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny hesla uživatele" };
	}
};

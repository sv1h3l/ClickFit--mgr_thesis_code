import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	userEmail: string;
	value: string;
}

export const changeUserSexMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE users
				SET sex = ?
				WHERE user_id = ? AND email = ?
			`;

		await db.promise().query(query, [props.value, props.userId, props.userEmail]);

		return { status: GenEnum.SUCCESS, message: "Pohlaví uživatele úspěšně změněno" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny pohlaví uživatele" };
	}
};

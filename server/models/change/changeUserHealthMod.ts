import { db } from "../../server";
import { GenRes, GenEnum } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
	userEmail: string;
	health: string;
}

export const changeUserHealthMod = async (props: Props): Promise<GenRes<null>> => {
	try {
		const query = `
				UPDATE users
				SET health = ?
				WHERE user_id = ? AND email = ?
			`;

		await db.promise().query(query, [props.health, props.userId, props.userEmail]);

		return { status: GenEnum.SUCCESS, message: "Zdravotní údaje uživatele úspěšně změněny" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny zdravotních údajů uživatele" };
	}
};

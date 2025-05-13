import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;

	code: number;
	isTextSize: boolean;
}

export const changeUserSettingsMod = async (props: Props): Promise<GenRes<null>> => {
	const query = `
		UPDATE users
		SET ${props.isTextSize ? "text_size_code" : "color_scheme_code"} = ?
		WHERE user_id = ?
	`;

	try {
		await db.promise().query(query, [props.code, props.userId]);

		return { status: GenEnum.SUCCESS, message: "Nastavení uživatele úspěšně změněno" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny nastavení uživatele" };
	}
};

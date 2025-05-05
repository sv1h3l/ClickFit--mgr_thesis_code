import bcrypt from "bcryptjs";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	token: string;
	password: string;
}

export const newPswMod = async (props: Props): Promise<GenRes<null>> => {
	const query = `
		UPDATE users
		SET hashed_password = ?
		WHERE token = ?
		`;

	try {
		const hashedPassword = await bcrypt.hash(props.password, 10);

		await db.promise().query(query, [hashedPassword, props.token]);

		return { status: GenEnum.SUCCESS, message: "Heslo uživatele úspěšně změněno" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během změny hesla uživatele" };
	}
};

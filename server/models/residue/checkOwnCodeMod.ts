import { RowDataPacket } from "mysql2";
import { db } from "../../server";
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	connectionCode: number;
	userId: number;
}

export const checkOwnCodeMod = async (props: Props): Promise<GenRes<null>> => {
	const checkQuery = `
					SELECT * FROM users
					WHERE connection_code = ? AND user_id = ? LIMIT 1
				`;

	try {
		const [ownConnection] = await db.promise().query<RowDataPacket[]>(checkQuery, [props.connectionCode, props.userId]);

		if (ownConnection.length > 0) {
			return { status: GenEnum.BAD_REQUEST, message: "Nelze navázat spojení sám se sebou" };
		}

		return { status: GenEnum.SUCCESS, message: "Uživatel nechce navázat spojení sám se sebou" };
	} catch (error) {
		console.error("Database error: " + error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během hledání vlastního kód spojení" };
	}
};

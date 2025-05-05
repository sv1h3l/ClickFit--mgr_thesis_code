import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	connectionId: number;
}

interface Res {
	messageId: number;
	connectionId: number;
	userId: number;

	message: string;
	imageUrl?: string;
	createdAt: string;
}

export const getMessagesMod = async (props: Props): Promise<GenRes<Res[]>> => {
	try {
		const secondUserQuery = `
			SELECT
				message_id AS messageId,
				connection_id AS connectionId,
				message,
				image_url AS imageUrl,
				created_at AS createdAt,
				user_id AS userId
			FROM chats
			WHERE connection_id = ?;
		`;

		const [rows] = await db.promise().query<RowDataPacket[]>(secondUserQuery, [props.connectionId]);

		return {
			status: GenEnum.SUCCESS,
			message: "Zprávy nalezeny",
			data: rows as Res[],
		};
	} catch (error) {
		console.error("Database error: ", error);
		return {
			status: GenEnum.FAILURE,
			message: "Nastala chyba během hledání zpráv",
		};
	}
};

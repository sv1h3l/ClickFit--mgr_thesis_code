import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";

interface Props {
	userId: number;
}

interface Res {
	connectionId: number;
	connectedUserId: number;

	connectedUserFirstName: string;
	connectedUserLastName: string;

	orderNumber: number;
}

export const getConnectedUsersMod = async (props: Props): Promise<GenRes<Res[]>> => {
	try {
		const secondUsersQuery = `
						SELECT 
							c.connection_id AS connectionId,
							c.second_user_id AS connectedUserId,
							c.first_user_order_number AS orderNumber,
							u.first_name AS connectedUserFirstName,
							u.last_name AS connectedUserLastName
						FROM connections c
						JOIN users u ON u.user_id = c.second_user_id
						WHERE c.first_user_id = ?

						UNION

						SELECT 
							c.connection_id AS connectionId,
							c.first_user_id AS connectedUserId,
							c.second_user_order_number AS orderNumber,
							u.first_name AS connectedUserFirstName,
							u.last_name AS connectedUserLastName
						FROM connections c
						JOIN users u ON u.user_id = c.first_user_id
						WHERE c.second_user_id = ?
					`;

		const [rows] = await db.promise().query<RowDataPacket[]>(secondUsersQuery, [props.userId, props.userId]);

		return { status: GenEnum.SUCCESS, message: "Spojení úspěšně nalezeny", data: rows as Res[] };
	} catch (error) {
		console.error("Database error: ", error);
		return { status: GenEnum.FAILURE, message: "Nastala chyba během hledání spojení" };
	}
};

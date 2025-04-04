import { Request } from "express";
import { RowDataPacket } from "mysql2";
import { db } from "../../server"; // Import připojení k DB
import { GenEnum, GenRes } from "../../utilities/GenResEnum";
const cookie = require("cookie");

interface Props {
	req: Request;
	authToken?: string;
}

export const getUserAtrFromAuthTokenMod = async (props: Props): Promise<GenRes<{ userId: number; userEmail: string }>> => {
	let concreteAuthToken;

	if (props.authToken) {
		concreteAuthToken = props.authToken;
	} else {
		const cookies = cookie.parse(props.req.headers.cookie || "");
		concreteAuthToken = cookies.authToken || null;
	}

	const query = `SELECT user_id, email FROM users WHERE auth_token = ?`;

	try {
		const [results] = await db.promise().query<RowDataPacket[]>(query, [concreteAuthToken]);
		if (results.length === 0) {
			console.error("Uživatel nenalezen");
			return { status: GenEnum.FAILURE, message: "Uživatel nenalezen", data: { userId: -1, userEmail: "" } };
		}

		return { status: GenEnum.SUCCESS, message: "Uživatel úspěšně nalezen", data: { userId: results[0].user_id, userEmail: results[0].email } };
	} catch (error) {
		console.error("Databázová chyba: ", error);
		return { status: GenEnum.FAILURE, message: "Uživatel nenalezen", data: { userId: -1, userEmail: "" } };
	}
};

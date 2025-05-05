import { Request, Response } from "express";
import { createConnectionMod } from "../../models/create/createConnectionMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { checkConnectionCodeMod } from "../../models/residue/checkConnectionCodeMod";
import { checkExistingConnectionMod } from "../../models/residue/checkExistingConnectionMod";
import { GenEnum } from "../../utilities/GenResEnum";

interface ConnectedUser {
	connectionId: number;
	connectedUserId: number;

	connectedUserFirstName: string;
	connectedUserLastName: string;

	orderNumber: number;
	unreadMessages: number;
}

export const createConnectionCont = async (req: Request, res: Response): Promise<void> => {
	const { connectionCode } = req.body;

	if (!connectionCode || connectionCode === -1 || typeof connectionCode !== "number" || connectionCode.toString().length !== 12) {
		res.status(400).json({ message: "Kód spojení musí být 12ciferné číslo" });
		return;
	}

	try {
		const userAtrs = await getUserAtrFromAuthTokenMod({ req });
		if (userAtrs.status !== GenEnum.SUCCESS || !userAtrs.data) {
			res.status(userAtrs.status).json({ message: userAtrs.message });
			return;
		}

		const dbCheckConnectionCode = await checkConnectionCodeMod({ connectionCode });
		if (dbCheckConnectionCode.status !== GenEnum.SUCCESS || !dbCheckConnectionCode.data) {
			res.status(dbCheckConnectionCode.status).json({ message: dbCheckConnectionCode.message });
			return;
		}

		const dbCheckExistingConnection = await checkExistingConnectionMod({ firstUserId: userAtrs.data.userId, secondUserId: dbCheckConnectionCode.data.user_id });
		if (dbCheckExistingConnection.status !== GenEnum.SUCCESS) {
			res.status(dbCheckExistingConnection.status).json({ message: dbCheckExistingConnection.message });
			return;
		}

		const dbResult = await createConnectionMod({ firstUserId: userAtrs.data.userId, secondUserId: dbCheckConnectionCode.data.user_id });

		const connectedUser = {
			connectionId: dbResult.data?.connectionId,
			connectedUserId: dbCheckConnectionCode.data.user_id,

			connectedUserFirstName: dbCheckConnectionCode.data.first_name,
			connectedUserLastName: dbCheckConnectionCode.data.last_name,

			orderNumber: 1,
			unreadMessages: 0,
		} as ConnectedUser;

		res.status(dbResult.status).json({ message: dbResult.message, data: connectedUser });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

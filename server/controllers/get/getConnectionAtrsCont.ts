import { Request, Response } from "express";
import { getConnectedUsersMod } from "../../models/get/getConnectedUsersMod";
import { getConnectionCodeMod } from "../../models/get/getConnectionCodeMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const getConnectionAtrsCont = async (req: Request, res: Response): Promise<void> => {
	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token", data: [] });
		return;
	}

	try {
		const dbUserAtr = await getUserAtrFromAuthTokenMod({ req, authToken });
		if (dbUserAtr.status === GenEnum.FAILURE || !dbUserAtr.data) {
			res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
			return;
		}

		const resCode = await getConnectionCodeMod({ userId: dbUserAtr.data.userId });

		const resUsers = await getConnectedUsersMod({ userId: dbUserAtr.data.userId });

		const sortedConnectedUsers = resUsers.data?.sort((a, b) => a.orderNumber - b.orderNumber);

		res.status(resUsers.status).json({ message: resUsers.message, data: { connectionCode: resCode.data?.connectionCode, connectedUsers: sortedConnectedUsers } });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

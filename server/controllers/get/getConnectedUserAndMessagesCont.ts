import { Request, Response } from "express";
import { getConnectedUserMod } from "../../models/get/getConnectedUserMod";
import { getMessagesMod } from "../../models/get/getMessagesMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { changeUnreadMessagesMod } from "../../models/change/changeUnreadMessagesMod";

export const getConnectedUserAndMessagesCont = async (req: Request, res: Response): Promise<void> => {
	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token" });
		return;
	}

	const connectionId = Number(req.query.connectionId);
	if (isNaN(connectionId)) {
		res.status(400).json({ message: "Neplatné ID spojení" });
		return;
	}

	try {
		const dbUserAtr = await getUserAtrFromAuthTokenMod({ req, authToken });
		if (dbUserAtr.status === GenEnum.FAILURE || !dbUserAtr.data) {
			res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
			return;
		}

		const resUser = await getConnectedUserMod({
			userId: dbUserAtr.data.userId,
			connectionId,
		});

		const resMessages = await getMessagesMod({
			connectionId,
		});

		changeUnreadMessagesMod({
			userId: dbUserAtr.data.userId,
			connectionId,
		});

		res.status(resMessages.status).json({
			message: resMessages.message,
			data: { userId: dbUserAtr.data.userId, connectedUser: resUser.data, messages: resMessages.data },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Nastala serverová chyba, zkuste to znovu",
		});
	}
};

import { Request, Response } from "express";
import { getAllUserAtrsMod } from "../../models/get/getAllUserAtrsMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { getUserSettingsMod } from "../../models/get/getUserSettingsMod";

export const getUserSettingsCont = async (req: Request, res: Response): Promise<void> => {
	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token", data: [] });
		return;
	}

	try {
		const userAtrs = await getUserAtrFromAuthTokenMod({ req, authToken });
		if (userAtrs.status !== GenEnum.SUCCESS || !userAtrs.data) {
			res.status(userAtrs.status).json({ message: userAtrs.message });
			return;
		}
		const userSettings = await getUserSettingsMod({ userId: userAtrs.data.userId});

		res.status(userSettings.status).json({ message: userSettings.message, data: userSettings.data });
	} catch (error) {
		console.error("Nastala serverová chyba: " + error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

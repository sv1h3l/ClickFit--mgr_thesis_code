import { Request, Response } from "express";
import { changeUserSettingsMod } from "../../models/change/changeUserSettingsMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const changeUserSettingsCont = async (req: Request, res: Response): Promise<void> => {
	const { code, isTextSize } = req.body;

	try {
		const userAtrs = await getUserAtrFromAuthTokenMod({ req });
		if (userAtrs.status !== GenEnum.SUCCESS || !userAtrs.data) {
			res.status(userAtrs.status).json({ message: userAtrs.message });
			return;
		}

		const dbRes = await changeUserSettingsMod({ userId: userAtrs.data.userId, code, isTextSize });

		res.status(dbRes.status).json({ message: dbRes.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

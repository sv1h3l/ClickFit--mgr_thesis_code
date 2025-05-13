import { Request, Response } from "express";
import { changeSharedSportMod } from "../../models/change/changeSharedSportMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const changeSharedSportCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, userId, sportIsShared } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu." });
		return;
	}

	if (!userId || userId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID uživatele." });
		return;
	}

	try {
		const dbUserAtr = await getUserAtrFromAuthTokenMod({ req });
		if (dbUserAtr.status === GenEnum.FAILURE || !dbUserAtr.data) {
			res.status(dbUserAtr.status).json({ message: dbUserAtr.message });
			return;
		}

		const dbResult = await changeSharedSportMod({ sportId, userId, sportIsShared, authorId: dbUserAtr.data.userId });

		res.status(dbResult.status).json({ message: dbResult.message, data: dbResult.data?.sharedSportId });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

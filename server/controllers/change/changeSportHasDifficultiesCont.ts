import { Request, Response } from "express";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { changeSportHasDifficultiesMod } from "../../models/change/changeSportHasDifficultiesMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const changeSportHasDifficultiesCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, hasDifficulties } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu." });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({req, id:sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbResult = await changeSportHasDifficultiesMod({ sportId, hasDifficulties });

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

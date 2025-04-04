import { Request, Response } from "express";
import { createSportDifficultyMod } from "../../models/create/createSportDifficultyMod";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { GenEnum } from "../../utilities/GenResEnum";

export const createSportDifficultyCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, difficultyName, orderNumber } = req.body;

	if (!sportId) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({req, id:sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbResult = await createSportDifficultyMod({ sportId, difficultyName, orderNumber });

		res.status(dbResult.status).json({ message: dbResult.message, data: dbResult.data });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

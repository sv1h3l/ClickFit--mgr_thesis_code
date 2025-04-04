import { Request, Response } from "express";
import { reorderExerciseInformationLabsMod } from "../../models/move/reorderExerciseInformationLabsMod";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { reorderTwoSportDifficultiesMod } from "../../models/move/reorderTwoSportDifficultiesMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const moveSportDifficultyCont = async (req: Request, res: Response): Promise<void> => {
	const {sportId, reorderDifficulties } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (reorderDifficulties.length < 1) {
		res.status(400).json({ message: "Nebyly předány obtížnosti pro přeuspořádání" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({req, id:sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbReorderResult = await reorderTwoSportDifficultiesMod({ sportId, reorderDifficulties });

		res.status(dbReorderResult.status).json({ message: dbReorderResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

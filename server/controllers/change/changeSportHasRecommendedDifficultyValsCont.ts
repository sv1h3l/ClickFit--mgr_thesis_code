import { Request, Response } from "express";
import { changeSportHasRecommendedDifficultyValsMod } from "../../models/change/changeSportHasRecommendedDifficultyValsMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const changeSportHasRecommendedDifficultyValsCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, hasRecommendedDifficultyValues } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu." });
		return;
	}

	const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
	if (checkRes.status !== GenEnum.SUCCESS) {
		res.status(checkRes.status).json({ message: checkRes.message });
		return;
	}

	try {
		const dbResult = await changeSportHasRecommendedDifficultyValsMod({ sportId, hasRecommendedDifficultyValues });

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

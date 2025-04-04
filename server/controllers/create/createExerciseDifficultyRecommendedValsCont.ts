import { Request, Response } from "express";
import { createExerciseDifficultyRecommendedValsMod } from "../../models/create/createExerciseDifficultyRecommendedValsMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const createExerciseDifficultyRecommendedValsCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, sportDifficultyId, exerciseId, series, repetitions, burden } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (!sportDifficultyId || sportDifficultyId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID obtížnosti sportu" });
		return;
	}

	if (!exerciseId || exerciseId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID cviku" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({req,id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbResult = await createExerciseDifficultyRecommendedValsMod({ sportDifficultyId, exerciseId, series, repetitions, burden });

		res.status(dbResult.status).json({ message: dbResult.message, data: dbResult.data });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

import { Request, Response } from "express";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { changeExerciseRecommendedValsMod } from "../../models/change/changeExerciseRecommendedValsMod";
import { GenEnum } from "../../utilities/GenResEnum";

export const changeExerciseRecommendedValsCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, exerciseId, seriesRepetitonsOrBurden, series, repetitions, burden } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (!exerciseId || exerciseId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID cviku" });
		return;
	}

	if (seriesRepetitonsOrBurden < 1 || seriesRepetitonsOrBurden > 3) {
		res.status(400).json({ message: "Nebyl předán kód identifikující série, opakování nebo zátěž" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({req, id:sportId, checkAuthorizationCode:CheckAuthorizationCodeEnum.SPORT_EDIT});
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbResult = await changeExerciseRecommendedValsMod({ sportId, exerciseId,seriesRepetitonsOrBurden, series, repetitions, burden });

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

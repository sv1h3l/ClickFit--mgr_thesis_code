import { Request, Response } from "express";
import { changeExerciseUnitCodeMod } from "../../models/change/changeExerciseUnitCodeMod";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { GenEnum } from "../../utilities/GenResEnum";

export const changeExerciseUnitCodeCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, exerciseId, unitCode } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (!exerciseId || exerciseId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID cviku" });
		return;
	}

	if (!unitCode || unitCode === -1) {
		res.status(400).json({ message: "Předán nevalidní kód jednotky" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbResult = await changeExerciseUnitCodeMod({ sportId, exerciseId, unitCode });

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

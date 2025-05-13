import { Request, Response } from "express";
import { changeExerciseNameMod } from "../../models/change/changeExerciseNameMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { checkExerciseNameExistenceMod } from "../../models/residue/checkExerciseNameExistenceMod";

export const changeExerciseNameCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, exerciseId, exerciseName } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu." });
		return;
	}

	if (!exerciseId || exerciseId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID cviku." });
		return;
	}

	if (exerciseName.length < 1) {
		res.status(400).json({ message: "Název nesmí být prázdný" });
		return;
	}

	if (exerciseName.length > 75) {
		res.status(400).json({ message: "Název nesmí být delší než 75 znaků" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const checkExerciseNameRes = await checkExerciseNameExistenceMod({ sportId, exerciseName });

		if(checkExerciseNameRes.status === GenEnum.ALREADY_EXISTS) {
			res.status(checkExerciseNameRes.status).json({ message: checkExerciseNameRes.message });
			return;
		}

		const dbResult = await changeExerciseNameMod({ sportId, exerciseId, exerciseName });

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

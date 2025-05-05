import { Request, Response } from "express";
import { changeRepeatabilityQuantityMod } from "../../models/change/changeRepeatabilityQuantityMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const changeRepeatabilityQuantityCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, entityId, repeatabilityQuantity, entityIsExercise } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (!entityId || entityId === -1) {
		res.status(400).json({ message: `Předáno nevalidní ID ${entityIsExercise ? "cviku" : "kategorie"}.` });
		return;
	}

	const numRepeatabilityQuantity = Number(repeatabilityQuantity);

	if (isNaN(numRepeatabilityQuantity) || numRepeatabilityQuantity < 1 || numRepeatabilityQuantity > 9) {
		res.status(400).json({ message: "Předána nevalidní hodnota maximálního počtu opakování" });
		return;
	}

	const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
	if (checkRes.status !== GenEnum.SUCCESS) {
		res.status(checkRes.status).json({ message: checkRes.message });
		return;
	}

	try {
		const dbResult = await changeRepeatabilityQuantityMod({ entityId, repeatabilityQuantity: numRepeatabilityQuantity , entityIsExercise});

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

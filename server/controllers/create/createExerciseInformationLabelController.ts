import { Request, Response } from "express";
import { createExerciseInformationLabelModel } from "../../models/create/createExerciseInformationLabelModel";
import { CheckAuthorizationCodeEnum, checkAuthorizationController } from "../residue/checkAuthorizationController";

export const createExerciseInformationLabelController = async (req: Request, res: Response): Promise<void> => {
	const { sportId, exerciseInformationLabel, orderNumber } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (!exerciseInformationLabel) {
		res.status(400).json({ message: "Informace o cviku nesmí být prázdná" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationController(req, sportId, CheckAuthorizationCodeEnum.SPORT_EDITING);
		if (!checkRes.authorized) {
			res.status(401).json({ message: checkRes.message });
		}

		const dbLabelResult = await createExerciseInformationLabelModel({ sportId, exerciseInformationLabel, orderNumber });

		res.status(dbLabelResult.status).json({ message: dbLabelResult.message, data: dbLabelResult.data });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

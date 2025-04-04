import { Request, Response } from "express";
import { createExerciseInformationLabMod } from "../../models/create/createExerciseInformationLabMod";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { GenEnum } from "../../utilities/GenResEnum";

export const createExerciseInformationLabCont = async (req: Request, res: Response): Promise<void> => {
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
		const checkRes = await checkAuthorizationCont({req, id:sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbLabelResult = await createExerciseInformationLabMod({ sportId, exerciseInformationLabel, orderNumber });

		res.status(dbLabelResult.status).json({ message: dbLabelResult.message, data: dbLabelResult.data });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

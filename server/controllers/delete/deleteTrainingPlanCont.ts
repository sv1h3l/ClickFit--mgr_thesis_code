import { Request, Response } from "express";
import { deleteSportMod } from "../../models/delete/deleteSportMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { deleteTrainingPlanMod } from "../../models/delete/deleteTrainingPlanMod";

export const deleteTrainingPlanCont = async (req: Request, res: Response): Promise<void> => {
	const { trainingPlanId, orderNumber } = req.body;

	if (!trainingPlanId || trainingPlanId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu." });
		return;
	}

	
	if (!orderNumber || orderNumber === -1) {
		res.status(400).json({ message: "Předáno nevalidní číslo pořadí tréninkového plánu." });
		return;
	}


	try {
		const checkRes = await checkAuthorizationCont({ req, id: trainingPlanId, checkAuthorizationCode: CheckAuthorizationCodeEnum.TRAINING_PLAN_VIEW });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbResult = await deleteTrainingPlanMod({ trainingPlanId, orderNumber});

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

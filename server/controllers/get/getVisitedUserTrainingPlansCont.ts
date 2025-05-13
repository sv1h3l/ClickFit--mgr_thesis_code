import { Request, Response } from "express";
import { getTrainingPlansMod } from "../../models/get/getTrainingPlansMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { checkAuthorizationCont, CheckAuthorizationCodeEnum } from "../residue/checkAuthorizationCont";

export const getVisitedUserTrainingPlansCont = async (req: Request, res: Response): Promise<void> => {
	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token", data: [] });
		return;
	}

	const visitedUserId = Number(req.query.visitedUserId);

	if (!visitedUserId || visitedUserId < 1) {
		res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
		return;
	}
	const checkRes = await checkAuthorizationCont({ req, authToken, id: visitedUserId, checkAuthorizationCode: CheckAuthorizationCodeEnum.USER_VISIT });
	if (checkRes.status !== GenEnum.SUCCESS) {
		res.status(checkRes.status).json({ message: checkRes.message });
		return;
	}

	try {
		const dbResTrainingPlans = await getTrainingPlansMod({ userId: visitedUserId });

		res.status(dbResTrainingPlans.status).json({
			message: dbResTrainingPlans.message,
			data: {
				userId: visitedUserId,
				trainingPlans: dbResTrainingPlans.data,
			},
		});
	} catch (error) {
		console.error("Chyba při získání tréninkových plánů: ", error);
		res.status(500).json({ message: "Chyba při získání tréninkových plánů" });
	}
};

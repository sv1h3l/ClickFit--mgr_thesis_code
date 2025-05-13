import { Request, Response } from "express";
import { getConcreteTrainingPlanExercisesMod } from "../../models/get/getConcreteTrainingPlanExercisesMod";
import { getConcreteTrainingPlanMod } from "../../models/get/getConcreteTrainingPlanMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const getVisitedUserConcreteTrainingPlanDayCont = async (req: Request, res: Response): Promise<void> => {
	const authToken = req.headers["authorization"]?.split(" ")[1];

	if (!authToken) {
		res.status(400).json({ message: "Chybějící token" });
		return;
	}

	const trainingPlanId = Number(req.query.trainingPlanId);

	if (!trainingPlanId || trainingPlanId < 1) {
		res.status(400).json({ message: "Nevalidní ID tréninkového plánu" });
		return;
	}

	const dayOrderNumber = Number(req.query.dayOrderNumber);

	if (!dayOrderNumber || dayOrderNumber < 1) {
		res.status(400).json({ message: "Nevalidní identifikátor dne tréninkového plánu" });
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
		const dbResTrainingPlanExercises = await getConcreteTrainingPlanExercisesMod({ trainingPlanId, dayOrderNumber });

		const dbResTrainingPlan = await getConcreteTrainingPlanMod({ trainingPlanId });

		res.status(dbResTrainingPlanExercises.status).json({
			message: dbResTrainingPlanExercises.message,
			data: {
				trainingPlan: dbResTrainingPlan.data,
				trainingPlanExercises: dbResTrainingPlanExercises.data,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

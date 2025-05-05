import { Request, Response } from "express";
import { getTrainingPlanExercisesMod } from "../../models/get/getTrainingPlanExercisesMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const getTrainingPlanExercisesCont = async (req: Request, res: Response): Promise<void> => {
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

	const checkRes = await checkAuthorizationCont({ req, authToken, id: trainingPlanId, checkAuthorizationCode: CheckAuthorizationCodeEnum.TRAINING_PLAN_VIEW });
	if (checkRes.status !== GenEnum.SUCCESS && !checkRes.data) {
		res.status(checkRes.status).json({ message: checkRes.message });
		return;
	}

	try {
		const dbResTrainingPlanExercises = await getTrainingPlanExercisesMod({ trainingPlanId });

		res.status(dbResTrainingPlanExercises.status).json({
			message: dbResTrainingPlanExercises.message,
			data: {
				trainingPlanExercises: dbResTrainingPlanExercises.data,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

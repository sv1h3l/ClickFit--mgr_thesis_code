import { Request, Response } from "express";
import { changeTrainingPlanMod } from "../../models/change/changeTrainingPlanMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { TrainingPlanExercise } from "../create/createTrainingPlanCont";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

interface Props {
	trainingPlanId: number;

	trainingPlanName: string;
	canOwnerEdit: boolean;

	hasBurdenAndUnit: boolean;
	unitCode: number;

	trainingPlanExercises: TrainingPlanExercise[];
}

export const changeTrainingPlanCont = async (req: Request, res: Response): Promise<void> => {
	const props = req.body as Props;

	if (!props.trainingPlanId && props.trainingPlanId < 1) {
		res.status(400).json({ message: "Předáno nevalidní ID tréninkového plánu." });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({ req, id: props.trainingPlanId, checkAuthorizationCode: CheckAuthorizationCodeEnum.TRAINING_PLAN_VIEW });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbResult = await changeTrainingPlanMod({
			trainingPlanId: props.trainingPlanId,
			trainingPlanName: props.trainingPlanName,
			trainingPlanExercises: props.trainingPlanExercises,
			hasBurdenAndUnit: props.hasBurdenAndUnit,
			unitCode: props.unitCode,
		});

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

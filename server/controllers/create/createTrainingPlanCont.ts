import { Request, Response } from "express";
import { createTrainingPlanMod } from "../../models/create/createTrainingPlanMod";
import { getUserAtrFromAuthTokenMod } from "../../models/get/getUserAtrFromAuthTokenMod";
import { GenEnum } from "../../utilities/GenResEnum";

export interface TrainingPlanExercise {
	trainingPlanExerciseId?: number;
	exerciseId: number;

	nthDay: number;
	nthCategory: number;
	nthExercise: number;

	categoryName: string;
	exerciseName: string;

	repetitions: number;
	series: number;
	burden: number;

	unitCode: number;
}

interface Props {
	ownerId: number;
	sportId: number;

	trainingPlanName: string;
	canOwnerEdit: boolean;

	hasBurdenAndUnit: boolean;
	unitCode: number;

	trainingPlanExercises: TrainingPlanExercise[];
}

export const createTrainingPlanCont = async (req: Request, res: Response): Promise<void> => {
	const props = req.body as Props;

	try {
		const userAtrs = await getUserAtrFromAuthTokenMod({ req });
		if (userAtrs.status !== GenEnum.SUCCESS || !userAtrs.data) {
			res.status(userAtrs.status).json({ message: userAtrs.message });
			return;
		}

		const today = new Date();
		const dateOfCreation = `${today.getDate()}. ${today.getMonth() + 1}. ${today.getFullYear()}`;

		const dbResult = await createTrainingPlanMod({
			authorId: userAtrs.data.userId,
			ownerId: props.ownerId,
			sportId: props.sportId,
			trainingPlanName: props.trainingPlanName,
			canOwnerEdit: props.canOwnerEdit,
			trainingPlanExercises: props.trainingPlanExercises,
			dateOfCreation,
			hasBurdenAndUnit: props.hasBurdenAndUnit,
			unitCode: props.unitCode,
		});

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

import { Request, Response } from "express";
import { changeExerciseInformationValueModel } from "../../models/change/changeExerciseInformationValueModel";
import { createExerciseInformationValueModel } from "../../models/create/createExerciseInformationValueModel";
import { GenericModelReturnEnum } from "../../models/GenericModelReturn";
import { CheckAuthorizationCodeEnum, checkAuthorizationController } from "../residue/checkAuthorizationController";

export const createExerciseInformationValueController = async (req: Request, res: Response): Promise<void> => {
	const { sportId, exerciseId, exerciseInformationLabelId, exerciseInformationValue } = req.body;

	if (!exerciseInformationLabelId) {
		res.status(400).json({ message: "Předáno nevalidní ID informace o cviku" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationController(req, sportId, CheckAuthorizationCodeEnum.SPORT_EDITING);
		if (!checkRes.authorized) {
			res.status(401).json({ message: checkRes.message });
		}

		const dbCreateResult = await createExerciseInformationValueModel({ exerciseInformationValue, exerciseInformationLabelId, exerciseId, userId: checkRes.userId || -1 });

		if (dbCreateResult.status === GenericModelReturnEnum.ALREADY_EXIST) {
			const dbChangeResult = await changeExerciseInformationValueModel({ exerciseInformationValueId: dbCreateResult.data || -1, exerciseInformationValue });

			res.status(dbChangeResult.status).json({ message: dbChangeResult.message, data: dbCreateResult.data });
		} else {
			res.status(dbCreateResult.status).json({ message: dbCreateResult.message, data: dbCreateResult.data });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

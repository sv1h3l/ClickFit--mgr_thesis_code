import { Request, Response } from "express";
import { changeExerciseInformationValMod } from "../../models/change/changeExerciseInformationValMod";
import { createExerciseInformationValMod } from "../../models/create/createExerciseInformationValMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const createExerciseInformationValCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, exerciseId, exerciseInformationLabelId, exerciseInformationValue } = req.body;

	if (!exerciseInformationLabelId) {
		res.status(400).json({ message: "Předáno nevalidní ID informace o cviku" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({req, id:sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
		if (checkRes.status !== GenEnum.SUCCESS || !checkRes.data) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbCreateResult = await createExerciseInformationValMod({ exerciseInformationValue, exerciseInformationLabelId, exerciseId, userId: checkRes.data.userId || -1 });

		if (dbCreateResult.status === GenEnum.ALREADY_EXISTS) {
			const dbChangeResult = await changeExerciseInformationValMod({ exerciseInformationValueId: dbCreateResult.data || -1, exerciseInformationValue });

			res.status(dbChangeResult.status).json({ message: dbChangeResult.message, data: dbCreateResult.data });
		} else {
			res.status(dbCreateResult.status).json({ message: dbCreateResult.message, data: dbCreateResult.data });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

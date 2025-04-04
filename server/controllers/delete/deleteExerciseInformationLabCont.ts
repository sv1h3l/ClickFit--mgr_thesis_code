import { Request, Response } from "express";
import { deleteExerciseInformationLabMod } from "../../models/delete/deleteExerciseInformationLabMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { reorderExerciseInformationLabsMod } from "../../models/move/reorderExerciseInformationLabsMod";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { deleteExerciseInformationValsMod } from "../../models/delete/deleteExerciseInformationValsMod";

export const deleteExerciseInformationLabCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, exerciseInformationLabelId, reorderExerciseInformationLabels } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (!exerciseInformationLabelId || exerciseInformationLabelId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID informace o cviku" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({req, id:sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT}); // FIXME vložit return k ostatním checkAutorization
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbDeleteLabelResult = await deleteExerciseInformationLabMod({ sportId, exerciseInformationLabelId });

		if (dbDeleteLabelResult.status === GenEnum.SUCCESS) {

			const dbDeleteValueResult = await deleteExerciseInformationValsMod({ exerciseInformationLabelId });

			if (reorderExerciseInformationLabels.length > 0) {
				const dbReorderResult = await reorderExerciseInformationLabsMod({ sportId, reorderExerciseInformationLabels });

				res.status(dbDeleteLabelResult.status).json({ message: dbDeleteLabelResult.message });
			}
		} else {
			res.status(dbDeleteLabelResult.status).json({ message: dbDeleteLabelResult.message });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

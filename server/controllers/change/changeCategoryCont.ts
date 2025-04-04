import { Request, Response } from "express";
import { changeCategoryMod } from "../../models/change/changeCategoryMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { getHighestOrderNumberOfCategoryMod } from "../../models/get/getHighestOrderNumberOfCategoryMod";
import { reorderExercisesMod } from "../../models/move/reorderExercisesMod";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const changeCategoryCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, categoryId, exerciseId, oldCategoryId, oldOrderNumber } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu." });
		return;
	}

	if (!categoryId || categoryId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID kategorie." });
		return;
	}

	if (!exerciseId || exerciseId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID cviku." });
		return;
	}

	const checkRes = await checkAuthorizationCont({req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
	if (checkRes.status !== GenEnum.SUCCESS) {
		res.status(checkRes.status).json({ message: checkRes.message });
		return;
	}

	try {
		const highestOrderNumber = await getHighestOrderNumberOfCategoryMod({ props: { sportId, categoryId } });

		if (highestOrderNumber.data) {
			const dbResult = await changeCategoryMod({ sportId, categoryId, exerciseId, highestOrderNumber: highestOrderNumber.data });

			const dbReorderExercises = await reorderExercisesMod({ sportId, categoryId: oldCategoryId, orderNumber: oldOrderNumber });

			if (dbReorderExercises.status === GenEnum.SUCCESS) {
				res.status(dbResult.status).json({ message: dbResult.message });
			} else {
				res.status(dbReorderExercises.status).json({ message: dbReorderExercises.message });
			}
		} else {
			res.status(highestOrderNumber.status).json({ message: highestOrderNumber.message });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

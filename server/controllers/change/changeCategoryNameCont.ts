import { Request, Response } from "express";
import { checkCategoryNameExistenceMod } from "../../models/residue/checkCategoryNameExistenceMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { changeCategoryNameMod } from "../../models/change/changeCategoryNameMod";

export const changeCategoryNameCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, categoryId, categoryName } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu." });
		return;
	}

	if (!categoryId || categoryId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID cviku." });
		return;
	}

	if (categoryName.length < 1) {
		res.status(400).json({ message: "Název nesmí být prázdný" });
		return;
	}

	if (categoryName.length > 40) {
		res.status(400).json({ message: "Název nesmí být delší než 40 znaků" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const checkCategoryNameRes = await checkCategoryNameExistenceMod({ sportId, categoryName });

		if (checkCategoryNameRes.status === GenEnum.ALREADY_EXISTS) {
			res.status(checkCategoryNameRes.status).json({ message: checkCategoryNameRes.message });
			return;
		}

		const dbResult = await changeCategoryNameMod({ sportId, categoryId, categoryName });

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

import { Request, Response } from "express";
import { checkCategoryNameExistenceMod } from "../../models/residue/checkCategoryNameExistenceMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";
import { changeCategoryNameMod } from "../../models/change/changeCategoryNameMod";
import { checkSportNameExistenceMod } from "../../models/residue/checkSportNameExistenceMod";
import { changeSportNameMod } from "../../models/change/changeSportNameMod";

export const changeSportNameCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, sportName } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu." });
		return;
	}

	if (sportName.length < 1) {
		res.status(400).json({ message: "Název nesmí být prázdný" });
		return;
	}

	if (sportName.length > 25) {
		res.status(400).json({ message: "Název nesmí být delší než 25 znaků" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({ req, id: sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT });
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const checkSportNameRes = await checkSportNameExistenceMod({ sportName, userId: checkRes.data?.userId! });

		if (checkSportNameRes.status === GenEnum.ALREADY_EXISTS) {
			res.status(checkSportNameRes.status).json({ message: checkSportNameRes.message });
			return;
		}

		const dbResult = await changeSportNameMod({ sportId, sportName });

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

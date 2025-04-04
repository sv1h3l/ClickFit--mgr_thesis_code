import { Request, Response } from "express";
import { moveSportDetailLabelMod } from "../../models/move/moveSportDetailLabelMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const moveSportDetailLabelCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, reorderSportDetailLabels } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (reorderSportDetailLabels.length < 1) {
		res.status(400).json({ message: "Nebyly předány informace o cvicích pro přeuspořádání" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({req, id:sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbReorderResult = await moveSportDetailLabelMod({ sportId, reorderSportDetailLabels });

		res.status(dbReorderResult.status).json({ message: dbReorderResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

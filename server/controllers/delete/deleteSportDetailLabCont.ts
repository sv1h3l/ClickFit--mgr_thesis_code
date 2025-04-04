import { Request, Response } from "express";
import { deleteSportDetailLabMod } from "../../models/delete/deleteSportDetailLabMod";
import { deleteSportDetailValsMod } from "../../models/delete/deleteSportDetailValsMod";
import { moveSportDetailLabelMod } from "../../models/move/moveSportDetailLabelMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const deleteSportDetailLabCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, sportDetailLabId, reorderSportDetailLabs } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (!sportDetailLabId || sportDetailLabId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID informace o cviku" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({req, id:sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbDeleteLabelResult = await deleteSportDetailLabMod({ sportId, sportDetailLabId });

		if (dbDeleteLabelResult.status === GenEnum.SUCCESS) {
			await deleteSportDetailValsMod({ sportDetailLabId });

			if (reorderSportDetailLabs.length > 0) {
				await moveSportDetailLabelMod({ sportId, reorderSportDetailLabels: reorderSportDetailLabs });

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

import { Request, Response } from "express";
import { changeSportDetailValMod } from "../../models/change/changeSportDetailValMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const changeSportDetailValCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, sportDetailValId, sportDetailVal } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (!sportDetailValId || sportDetailValId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID hodnoty údaje sportu" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({req, id:sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const dbResult = await changeSportDetailValMod({ userId: checkRes.data?.userId!, sportDetailValId, sportDetailVal });

		res.status(dbResult.status).json({ message: dbResult.message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};

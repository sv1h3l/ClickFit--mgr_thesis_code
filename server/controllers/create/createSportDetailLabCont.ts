import { Request, Response } from "express";
import { createSportDetailLabMod } from "../../models/create/createSportDetailLabMod";
import { createSportDetailValMod } from "../../models/create/createSportDetailValMod";
import { GenEnum } from "../../utilities/GenResEnum";
import { CheckAuthorizationCodeEnum, checkAuthorizationCont } from "../residue/checkAuthorizationCont";

export const createSportDetailLabCont = async (req: Request, res: Response): Promise<void> => {
	const { sportId, sportDetailLab, orderNumber } = req.body;

	if (!sportId || sportId === -1) {
		res.status(400).json({ message: "Předáno nevalidní ID sportu" });
		return;
	}

	if (!sportDetailLab) {
		res.status(400).json({ message: "Štítek údaje sportu nesmí být prázdný" });
		return;
	}

	try {
		const checkRes = await checkAuthorizationCont({req, id:sportId, checkAuthorizationCode: CheckAuthorizationCodeEnum.SPORT_EDIT});
		if (checkRes.status !== GenEnum.SUCCESS) {
			res.status(checkRes.status).json({ message: checkRes.message });
			return;
		}

		const resLabel = await createSportDetailLabMod({ sportId, sportDetailLab, orderNumber });

		let resVal;
		if (resLabel.status === GenEnum.SUCCESS) {
			resVal = await createSportDetailValMod({ sport_detail_label_id: resLabel.data!, userId: checkRes.data?.userId! });
		}

		res.status(resLabel.status).json({ message: resLabel.message, data: { sportDetailLabId: resLabel.data, sportDetailValId: resVal?.data } });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
	}
};
